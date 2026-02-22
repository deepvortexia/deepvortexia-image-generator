// lib/supabase/client.ts  (App Image Generator — Next.js)
// Session partagée via cookies sur .deepvortexai.art

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

const DOMAIN = '.deepvortexai.art'

const createCookieStorage = () => {
  return {
    getItem: (key: string): string | null => {
      if (typeof document === 'undefined') return null
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [name, ...rest] = cookie.trim().split('=')
        if (name.trim() === key) {
          try {
            return decodeURIComponent(rest.join('='))
          } catch {
            return null
          }
        }
      }
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },

    setItem: (key: string, value: string): void => {
      if (typeof document === 'undefined') return
      const encodedValue = encodeURIComponent(value)
      document.cookie = `${key}=${encodedValue}; path=/; domain=${DOMAIN}; max-age=604800; SameSite=Lax; Secure`
      try {
        localStorage.setItem(key, value)
      } catch { /* ignore */ }
    },

    removeItem: (key: string): void => {
      if (typeof document === 'undefined') return
      document.cookie = `${key}=; path=/; domain=${DOMAIN}; max-age=0; SameSite=Lax; Secure`
      try {
        localStorage.removeItem(key)
      } catch { /* ignore */ }
    },
  }
}

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

  clientInstance = createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'deepvortex-auth',  // ✅ Même clé que Emoticons
      storage: createCookieStorage(),
    },
  })

  return clientInstance
}
