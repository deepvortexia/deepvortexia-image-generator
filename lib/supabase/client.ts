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
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        for (const { name, value } of cookiesToSet) {
          let cookie = `${name}=${value}`
          cookie += '; path=/'
          cookie += '; domain=.deepvortexai.art'
          cookie += '; max-age=31536000'
          cookie += '; samesite=lax'
          cookie += '; secure'
          document.cookie = cookie
        }
      },
    },
  })

  return clientInstance
}
