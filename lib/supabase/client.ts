import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  if (clientInstance) return clientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Supabase configuration missing')
    }
    return null as any
  }

  // Use @supabase/ssr with shared cookie domain for ecosystem
  clientInstance = createBrowserClient(url, key, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'deepvortex-shared-auth',
    },
    cookies: {
      getAll() {
        const pairs = document.cookie.split(';')
        const cookies: { name: string; value: string }[] = []
        for (const pair of pairs) {
          const [name, ...rest] = pair.trim().split('=')
          if (name) {
            cookies.push({ name, value: rest.join('=') })
          }
        }
        return cookies
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          // CRITICAL: Set cookie on parent domain for cross-subdomain sharing
          let cookie = `${name}=${value}`
          cookie += '; path=/'
          cookie += '; domain=.deepvortexai.art'  // Note the leading dot!
          cookie += '; max-age=31536000'  // 1 year
          cookie += '; samesite=lax'
          cookie += '; secure'
          document.cookie = cookie
        }
      },
    },
  })

  return clientInstance
}
