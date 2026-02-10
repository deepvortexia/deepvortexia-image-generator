'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/supabase'

// Default credits given to new users on signup
const DEFAULT_SIGNUP_CREDITS = 3;

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)
  const supabase = createClient()

  // If Supabase is not configured, just render children without auth
  if (!supabase) {
    if (loading) {
      setTimeout(() => setLoading(false), 0)
    }
    return (
      <AuthContext.Provider value={{
        user: null,
        session: null,
        profile: null,
        loading: false,
        signInWithGoogle: async () => { throw new Error('Supabase not configured') },
        signInWithEmail: async () => ({ error: new Error('Supabase not configured') as AuthError }),
        signOut: async () => {},
        refreshProfile: async () => {},
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      console.log('🔍 Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('⚠️ Profile not found for user:', userId)
          return null
        }
        console.error('❌ Error fetching profile:', error)
        throw error
      }
      console.log('✅ Profile fetched successfully:', { id: data.id, email: data.email, credits: data.credits })
      return data
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
      return null
    }
  }, [supabase])

  const createProfile = useCallback(async (currentUser: User): Promise<Profile | null> => {
    try {
      console.log('🆕 Creating new profile for user:', currentUser.email)
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
          avatar_url: currentUser.user_metadata?.avatar_url,
          credits: DEFAULT_SIGNUP_CREDITS,
        })

      if (error && error.code !== '23505') {
        console.error('❌ Error creating profile:', error)
        throw error
      }
      
      console.log('✅ Profile created, fetching...')
      return await fetchProfile(currentUser.id)
    } catch (error) {
      console.error('❌ Error creating profile:', error)
      return null
    }
  }, [fetchProfile, supabase])

  const ensureProfile = useCallback(async (currentUser: User) => {
    console.log('🔄 Ensuring profile exists for user:', currentUser.email)
    let profileData = await fetchProfile(currentUser.id)
    if (!profileData) {
      console.log('⚠️ Profile not found, creating...')
      profileData = await createProfile(currentUser)
    }
    if (profileData) {
      console.log('✅ Profile ensured:', { email: profileData.email, credits: profileData.credits })
    }
    return profileData
  }, [fetchProfile, createProfile])

  const refreshProfile = useCallback(async () => {
    if (user) {
      console.log('🔄 Refreshing profile for user:', user.email)
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
      console.log('✅ Profile refreshed:', profileData ? { credits: profileData.credits } : 'null')
    }
  }, [user, fetchProfile])

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) return
    initialized.current = true

    console.log('🚀 AuthContext: Initializing...')

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, currentSession: any) => {
        console.log('📡 Auth event:', event)
        console.log('🔍 Auth State:', { 
          hasUser: !!currentSession?.user, 
          email: currentSession?.user?.email,
          loading 
        })

        if (currentSession?.user) {
          setSession(currentSession)
          setUser(currentSession.user)
          
          // Ensure profile is fetched to update state properly
          // Handle errors gracefully to avoid blocking auth flow
          try {
            const profileData = await ensureProfile(currentSession.user)
            setProfile(profileData)
            console.log('✅ Auth state updated:', { 
              user: currentSession.user.email, 
              profile: profileData ? { credits: profileData.credits } : null,
              loading: false
            })
          } catch (error) {
            console.error('❌ Error ensuring profile:', error)
            // Still set profile to null and continue - user is authenticated
            setProfile(null)
          } finally {
            setLoading(false)
          }
        } else {
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
          console.log('🚪 User signed out')
        }
      }
    )

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: initialSession }, error }: any) => {
      if (error) {
        console.error('❌ Error getting session:', error)
        setLoading(false)
        return
      }

      console.log('🔍 Initial session check:', { hasSession: !!initialSession })

      if (initialSession?.user) {
        console.log('✅ Found existing session for:', initialSession.user.email)
        setSession(initialSession)
        setUser(initialSession.user)
        const profileData = await ensureProfile(initialSession.user)
        setProfile(profileData)
        console.log('📝 Profile data loaded:', profileData ? { email: profileData.email, credits: profileData.credits } : 'null')
      }
      setLoading(false)
      console.log('✅ Auth initialization complete')
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [ensureProfile, supabase])

  const signInWithGoogle = async () => {
    console.log('🚀 Initiating Google sign-in with PKCE flow')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('❌ Google sign-in error:', error.message)
      throw error
    }
    console.log('✅ Redirecting to Google OAuth...')
  }

  const signInWithEmail = async (email: string) => {
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
