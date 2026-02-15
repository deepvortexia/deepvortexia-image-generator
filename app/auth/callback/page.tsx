'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setError('Authentication service not configured')
      return
    }

    // With implicit flow + detectSessionInUrl: true,
    // Supabase auto-parses the hash fragment on page load.
    // We listen for the auth state change to confirm it worked.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        // Session established, redirect home
        router.push('/')
      }
    })

    // Safety timeout: if no auth event fires within 5 seconds, redirect anyway
    // (session may have already been established before this component mounted)
    const timeout = setTimeout(() => {
      router.push('/')
    }, 5000)

    // Also check if session already exists (in case onAuthStateChange already fired)
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/')
      }
    }
    checkSession()

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full p-8 bg-gray-900 rounded-lg border border-red-500/20 text-center">
          <div className="mb-4 text-red-500 text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Failed</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <a href="/" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-300 text-lg">Completing sign in...</p>
      </div>
    </div>
  )
}
