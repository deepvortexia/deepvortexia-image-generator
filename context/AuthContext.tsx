'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js'
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

// Create a single stable Supabase client instance outside component
const supabase = createClient()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Handle case where Supabase is not configured
  if (!supabase) {
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

  // Fetch profile from database
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        console.error('Error fetching profile:', error)
        return null
      }
      return data
    } catch (err) {
      console.error('Exception fetching profile:', err)
      return null
    }
  }

  // Create new profile for user
  const createProfile = async (currentUser: User): Promise<Profile | null> => {
    try {
      const newProfile = {
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
        avatar_url: currentUser.user_metadata?.avatar_url,
        credits: DEFAULT_SIGNUP_CREDITS,
      }
      
      const { error } = await supabase.from('profiles').insert(newProfile)
      
      if (error && error.code !== '23505') { // Ignore duplicate key
        console.error('Error creating profile:', error)
        return null
      }
      
      // Fetch the created profile
      return await fetchProfile(currentUser.id)
    } catch (err) {
      console.error('Exception creating profile:', err)
      return null
    }
  }

  // Ensure profile exists (fetch or create)
  const ensureProfile = async (currentUser: User): Promise<Profile | null> => {
    let profileData = await fetchProfile(currentUser.id)
    if (!profileData) {
      profileData = await createProfile(currentUser)
    }
    return profileData
  }

  // Load user session and profile
  const loadUserAndProfile = async () => {
    try {
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        // Handle expired/invalid tokens
        if (userError.code === 'refresh_token_not_found' || 
            userError.code === 'invalid_refresh_token' ||
            userError.message?.toLowerCase().includes('refresh_token')) {
          await supabase.auth.signOut({ scope: 'local' })
        }
        setUser(null)
        setSession(null)
        setProfile(null)
        setLoading(false)
        return
      }

      if (currentUser) {
        setUser(currentUser)
        
        // Get session
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
        
        // Fetch or create profile
        const profileData = await ensureProfile(currentUser)
        setProfile(profileData)
      } else {
        setUser(null)
        setSession(null)
        setProfile(null)
      }
    } catch (err) {
      console.error('Error loading user:', err)
      setUser(null)
      setSession(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  // Initialize auth on mount
  useEffect(() => {
    // Load initial session
    loadUserAndProfile()

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log('Auth event:', event)
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setUser(currentSession.user)
          setSession(currentSession)
          
          // Fetch profile for the signed-in user
          const profileData = await ensureProfile(currentSession.user)
          setProfile(profileData)
          setLoading(false)
          
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setSession(null)
          setProfile(null)
          setLoading(false)
          
        } else if (event === 'TOKEN_REFRESHED' && currentSession?.user) {
          setSession(currentSession)
          // User stays the same, no need to refetch profile
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Refresh profile from database
  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user])

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      if (data.user) {
        setUser(data.user)
        setSession(data.session)
        const profileData = await ensureProfile(data.user)
        setProfile(profileData)
      }
    } catch (err) {
      console.error('Error refreshing session:', err)
    }
  }, [])

  // Sign in with Google
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

  // Sign in with Email (Magic Link)
  const signInWithEmail = async (email: string) => {
    return await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
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
