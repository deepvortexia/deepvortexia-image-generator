import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if env vars are not set (for build time)
  // This allows the app to build without Supabase configuration
  // and run in free-tier-only mode
  if (!url || !key) {
    console.warn('Supabase URL or API key not configured')
    // We use `as any` here intentionally to allow graceful degradation
    // The API routes check for null and skip auth validation
    return null as any
  }

  const cookieStore = await cookies()

  return createServerClient(
    url,
    key,
    {
      auth: {
        flowType: 'pkce',
        storageKey: 'deepvortex-shared-auth',
      },
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value
          console.log('🍪 Server GET cookie:', name, value ? '(exists)' : '(missing)')
          return value
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log('🍪 Server SET cookie:', name)
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignored in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          console.log('🍪 Server REMOVE cookie:', name)
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignored in Server Components
          }
        },
      },
    }
  )
}
