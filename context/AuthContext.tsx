'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/supabase'

const DEFAULT_SIGNUP_CREDITS = 2;

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const initialized = useRef(false)
  // KEY FIX: track if init already loaded profile to skip onAuthStateChange duplicate fetch
  const initProfileLoaded = useRef(false)
  
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  if (!supabase) {
    if (loading) setTimeout(() => setLoading(false), 0)
    return (
      <AuthContext.Provider value={{
        user: null, session: null, profile: null, loading: false,
        signInWithGoogle: async () => { throw new Error('Supabase not configured') },
        signInWithEmail: async () => ({ error: new Error('Supabase not configured') as AuthError }),
        signOut: async () => {},
        refreshProfile: async () => {},
        refreshSession: async () => {},
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }
      return data
    } catch {
      return null
    }
  }, [supabase])

  const createProfile = useCallback(async (currentUser: User): Promise<Profile | null> => {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
        avatar_url: currentUser.user_metadata?.avatar_url,
        credits: DEFAULT_SIGNUP_CREDITS,
      })
      if (error && error.code !== '23505') throw error
      return await fetchProfile(currentUser.id)
    } catch {
      return null
    }
  }, [fetchProfile, supabase])

  const ensureProfile = useCallback(async (currentUser: User) => {
    let profileData = await fetchProfile(currentUser.id)
    if (!profileData) profileData = await createProfile(currentUser)
    return profileData
  }, [fetchProfile, createProfile])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Safety timeout - 8 seconds max
    const loadingTimeout = setTimeout(() => setLoading(false), 8000)

    // Auth state listener - only runs for NEW events (login/logout), not initial load
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, currentSession: any) => {
        // Skip initial session detection - handled by getUser() below
        if (event === 'INITIAL_SESSION') return
        
        if (currentSession?.user) {
          setSession(currentSession)
          setUser(currentSession.user)
          
          // Only fetch profile if init hasn't already done it
          if (!initProfileLoaded.current) {
            try {
              const profileData = await ensureProfile(currentSession.user)
              setProfile(profileData)
            } catch {
              setProfile(null)
            }
          }
          setLoading(false)
        } else {
          // SIGNED_OUT
          setSession(null)
          setUser(null)
          setProfile(null)
          initProfileLoaded.current = false
          setLoading(false)
        }
      }
    )

    // Initial session check - this is the primary profile loader
    supabase.auth.getUser().then(async (response: { data: { user: User | null }, error: AuthError | null }) => {
      const { data: { user: initialUser }, error } = response
      
      if (error) {
        if (error?.code === 'refresh_token_not_found' || 
            error?.code === 'invalid_refresh_token' ||
            error?.message?.toLowerCase().includes('refresh_token')) {
          await supabase.auth.signOut({ scope: 'local' })
          setUser(null); setSession(null); setProfile(null)
        }
        setLoading(false)
        clearTimeout(loadingTimeout)
        return
      }

      if (initialUser) {
        setUser(initialUser)
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (currentSession) setSession(currentSession)
        
        try {
          const profileData = await ensureProfile(initialUser)
          setProfile(profileData)
          initProfileLoaded.current = true // Signal: don't re-fetch in onAuthStateChange
        } catch {}
      }
      
      setLoading(false)
      clearTimeout(loadingTimeout)
    })

    return () => {
      clearTimeout(loadingTimeout)
      subscription?.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) throw error
  }

  const signInWithEmail = async (email: string) => {
    return await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const signOut = async () => {
    initProfileLoaded.current = false
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      if (data.user) {
        setUser(data.user)
        setSession(data.session)
        const profileData = await ensureProfile(data.user)
        setProfile(profileData)
      }
    } catch {}
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      signInWithGoogle, signInWithEmail, signOut, refreshProfile, refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
