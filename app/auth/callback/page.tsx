'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  
  useEffect(() => {
    // With detectSessionInUrl: true, Supabase handles the token exchange
    // automatically when the page loads. Just redirect to home.
    // Small delay to ensure Supabase processes the URL hash
    const timer = setTimeout(() => {
      router.push('/')
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-300 text-lg">Completing sign in...</p>
      </div>
    </div>
  )
}
