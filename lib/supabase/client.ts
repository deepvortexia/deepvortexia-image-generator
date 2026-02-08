import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if env vars are not set (for build time)
  if (!url || !key) {
    console.warn('Supabase URL or API key not configured')
    return null as any
  }

  return createBrowserClient(url, key)
}
