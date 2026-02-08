import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if env vars are not set (for build time)
  // This allows the app to build without Supabase configuration
  // and run in free-tier-only mode
  if (!url || !key) {
    console.warn('Supabase URL or API key not configured')
    // We use `as any` here intentionally to allow graceful degradation
    // The AuthContext checks for null and provides a fallback
    return null as any
  }

  return createBrowserClient(url, key)
}
