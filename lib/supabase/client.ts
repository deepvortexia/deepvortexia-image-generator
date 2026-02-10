import { createBrowserClient, type CookieOptions } from '@supabase/ssr'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if env vars are not set (for build time)
  // This allows the app to build without Supabase configuration
  // and run in free-tier-only mode
  if (!url || !key) {
    console.warn('⚠️ Supabase configuration missing:', {
      hasUrl: !!url,
      hasKey: !!key,
      NEXT_PUBLIC_SUPABASE_URL: url ? '(set)' : '(missing)',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? '(set)' : '(missing)'
    })
    // We use `as any` here intentionally to allow graceful degradation
    // The AuthContext checks for null and provides a fallback
    return null as any
  }

  // Only log in development mode to avoid exposing infrastructure details
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Supabase client configured')
  }

  return createBrowserClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'sb-txznlbzrvbxjxujrmhee-auth-token',
      flowType: 'pkce',
    },
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') return undefined
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        const value = match ? match[2] : undefined
        console.log('🍪 Client GET cookie:', name, value ? '(exists)' : '(missing)')
        return value
      },
      set(name: string, value: string, options: CookieOptions) {
        if (typeof document === 'undefined') return
        console.log('🍪 Client SET cookie:', name)
        let cookie = `${name}=${value}`
        if (options.path) cookie += `; path=${options.path}`
        if (options.maxAge) cookie += `; max-age=${options.maxAge}`
        if (options.domain) cookie += `; domain=${options.domain}`
        if (options.sameSite) cookie += `; samesite=${options.sameSite}`
        if (options.secure) cookie += `; secure`
        document.cookie = cookie
      },
      remove(name: string, options: CookieOptions) {
        if (typeof document === 'undefined') return
        console.log('🍪 Client REMOVE cookie:', name)
        document.cookie = `${name}=; max-age=0${options.path ? `; path=${options.path}` : ''}`
      },
    },
  })
}
