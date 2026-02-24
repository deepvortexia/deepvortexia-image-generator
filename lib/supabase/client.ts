// lib/supabase/client.ts (Image Generator — Next.js)
// FIXED: Use @supabase/ssr createBrowserClient for proper PKCE handling
import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (clientInstance) return clientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Supabase configuration missing')
    }
    return null as any
  }

  // Use @supabase/ssr createBrowserClient for proper PKCE code_verifier handling
  // This ensures the code_verifier is stored and retrieved consistently
  clientInstance = createBrowserClient(url, key, {
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') return undefined
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        return match ? decodeURIComponent(match[2]) : undefined
      },
      set(name: string, value: string, options?: { maxAge?: number }) {
        if (typeof document === 'undefined') return
        // Cross-domain cookie for all deepvortexai.art subdomains
        document.cookie = `${name}=${encodeURIComponent(value)}; domain=.deepvortexai.art; path=/; max-age=${options?.maxAge || 31536000}; secure; samesite=lax`
      },
      remove(name: string) {
        if (typeof document === 'undefined') return
        document.cookie = `${name}=; domain=.deepvortexai.art; path=/; max-age=0; secure; samesite=lax`
      }
    }
  })

  return clientInstance
}
