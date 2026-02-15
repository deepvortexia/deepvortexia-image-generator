'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      if (!searchParams) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ SearchParams is null')
        }
        setError('Unable to process callback')
        setIsProcessing(false)
        return
      }

      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Auth callback triggered:', {
          hasCode: !!code,
          error: errorParam,
          error_description: errorDescription,
        })
      }

      // Handle OAuth error from provider
      if (errorParam) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Auth callback error:', errorParam, errorDescription)
        }
        setError(`Authentication failed: ${errorDescription || errorParam}`)
        setIsProcessing(false)
        return
      }

      // Handle missing code
      if (!code) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ No code parameter in callback URL')
        }
        setError('No authorization code received')
        setIsProcessing(false)
        return
      }

      // Exchange code for session using browser client (has access to localStorage PKCE verifier)
      const supabase = createClient()

      if (!supabase) {
        console.error('❌ Supabase client not configured')
        setError('Authentication service not configured')
        setIsProcessing(false)
        return
      }

      try {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Failed to exchange code for session:', exchangeError.message)
          }
          setError(`Failed to complete sign in: ${exchangeError.message}`)
          setIsProcessing(false)
          return
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Successfully exchanged code for session:', data.user?.email)
        }

        // Redirect to home page
        router.push('/')
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Exception during code exchange:', err)
        }
        setError('An unexpected error occurred during sign in')
        setIsProcessing(false)
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full p-8 bg-gray-900 rounded-lg border border-red-500/20 text-center">
          <div className="mb-4 text-red-500 text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Failed</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  if (isProcessing) {
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

  return null
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-300 text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
