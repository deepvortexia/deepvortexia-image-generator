'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/supabase'

// Default credits given to new users on signup
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
  const authListenerSet = useRef(false)
  const profileLoading = useRef(false)
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
        refreshSession: async () => {},
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Fetching profile for user:', userId)
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          if (process.env.NODE_ENV === 'development') {
            console.log('⚠️ Profile not found for user:', userId)
          }
          return null
        }
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Error fetching profile:', error)
        }
        throw error
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Profile fetched successfully:', { id: data.id, email: data.email, credits: data.credits })
      }
      return data
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error fetching profile:', error)
      }
      return null
    }
  }, [supabase])

  const createProfile = useCallback(async (currentUser: User): Promise<Profile | null> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🆕 Creating new profile for user:', currentUser.email)
      }
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
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Error creating profile:', error)
        }
        throw error
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Profile created, fetching...')
      }
      return await fetchProfile(currentUser.id)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error creating profile:', error)
      }
      return null
    }
  }, [fetchProfile, supabase])

  const ensureProfile = useCallback(async (currentUser: User) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Ensuring profile exists for user:', currentUser.email)
    }
    let profileData = await fetchProfile(currentUser.id)
    if (!profileData) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Profile not found, creating...')
      }
      profileData = await createProfile(currentUser)
    }
    if (profileData && process.env.NODE_ENV === 'development') {
      console.log('✅ Profile ensured:', { email: profileData.email, credits: profileData.credits })
    }
    return profileData
  }, [fetchProfile, createProfile])

  const refreshProfile = useCallback(async () => {
    if (user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Refreshing profile for user:', user.email)
      }
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Profile refreshed:', profileData ? { credits: profileData.credits } : 'null')
      }
    }
  }, [user, fetchProfile])

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) return
    initialized.current = true

    // Guard to prevent multiple auth listeners
    if (authListenerSet.current) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Auth listener already set, skipping...')
      }
      return
    }
    authListenerSet.current = true

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 AuthContext: Initializing...')
    }

    // Safety timeout - ensure loading never exceeds 8 seconds
    const loadingTimeout = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏰ Auth loading timeout reached after 8 seconds - forcing loading to false')
      }
      setLoading(false)
    }, 8000)

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, currentSession: any) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('📡 Auth event:', event)
          console.log('🔍 Auth State:', { 
            hasUser: !!currentSession?.user, 
            email: currentSession?.user?.email,
            loading 
          })
        }

        if (currentSession?.user) {
          setSession(currentSession)
          setUser(currentSession.user)
          
          // Ensure profile is fetched to update state properly
          // Handle errors gracefully to avoid blocking auth flow
          // Use profileLoading ref to prevent race conditions
          if (!profileLoading.current) {
            profileLoading.current = true;
            try {
              const profileData = await ensureProfile(currentSession.user)
              setProfile(profileData)
              if (process.env.NODE_ENV === 'development') {
                console.log('✅ Auth state updated:', { 
                  user: currentSession.user.email, 
                  profile: profileData ? { credits: profileData.credits } : null,
                  loading: false
                })
              }
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('❌ Error ensuring profile:', error)
              }
              // Still set profile to null and continue - user is authenticated
              setProfile(null)
            } finally {
              profileLoading.current = false;
              setLoading(false)
            }
          } else {
            setLoading(false)
          }
        } else {
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
          if (process.env.NODE_ENV === 'development') {
            console.log('🚪 User signed out')
          }
        }
      }
    )

    // Then check for existing session
    supabase.auth.getUser().then(async ({ data: { user: initialUser }, error }: any) => {
      if (error) {
        // Handle refresh token not found - clear invalid session immediately
        // Check for both possible refresh token error codes or message containing 'refresh_token'
        if (error?.code === 'refresh_token_not_found' || 
            error?.code === 'invalid_refresh_token' ||
            error?.message?.toLowerCase().includes('refresh_token')) {
          if (process.env.NODE_ENV === 'development') {
            console.log('⚠️ Refresh token error - clearing invalid session')
          }
          await supabase.auth.signOut({ scope: 'local' })
          setUser(null)
          setSession(null)
          setProfile(null)
          setLoading(false)
          return
        }
        
        // Other errors
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Error getting user:', error)
        }
        setLoading(false)
        return
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Initial user check:', { hasUser: !!initialUser })
      }

      if (initialUser) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Found existing user:', initialUser.email)
        }
        // Set user - onAuthStateChange will handle ensureProfile
        setUser(initialUser)
      }
      setLoading(false)
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Auth initialization complete')
      }
    })

    return () => {
      clearTimeout(loadingTimeout)
      if (subscription) {
        subscription.unsubscribe()
      }
      authListenerSet.current = false
    }
  }, [ensureProfile, supabase])

  const signInWithGoogle = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Initiating Google sign-in with PKCE flow')
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Google sign-in error:', error.message)
      }
      throw error
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Redirecting to Google OAuth...')
    }
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

  const refreshSession = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Refreshing session...')
      }
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Session refresh failed:', error)
        }
        throw error
      }
      if (data.user) {
        setUser(data.user)
        setSession(data.session)
        await ensureProfile(data.user)
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Session refreshed successfully')
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Session refresh failed:', err)
      }
    }
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
      refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
