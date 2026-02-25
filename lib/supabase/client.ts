// lib/supabase/client.ts (Image Generator — Next.js)
import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

const CHUNK_SIZE = 3000 // Safe size under 4096 limit

// Helper to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

// Helper to set cookie
const setCookieRaw = (name: string, value: string, maxAge: number = 31536000) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; domain=.deepvortexai.art; path=/; max-age=${maxAge}; secure; samesite=lax`
}

// Helper to remove cookie
const removeCookieRaw = (name: string) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; domain=.deepvortexai.art; path=/; max-age=0; secure; samesite=lax`
}

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

  clientInstance = createBrowserClient(url, key, {
    cookies: {
      get(name: string) {
        // First try to get it as a single cookie
        const singleValue = getCookie(name)
        if (singleValue) {
          return singleValue
        }

        // Try to get chunked cookies
        let result = ''
        let index = 0
        while (true) {
          const chunk = getCookie(`${name}.${index}`)
          if (!chunk) break
          result += chunk
          index++
        }

        if (result) {
          console.log(`[Image Auth] Retrieved ${index} chunks for ${name}`)
          return result
        }

        return undefined
      },

      set(name: string, value: string, options?: { maxAge?: number }) {
        const maxAge = options?.maxAge || 31536000

        // Remove any existing chunks first
        let i = 0
        while (getCookie(`${name}.${i}`)) {
          removeCookieRaw(`${name}.${i}`)
          i++
        }
        removeCookieRaw(name)

        // If value is small enough, store as single cookie
        if (value.length <= CHUNK_SIZE) {
          setCookieRaw(name, value, maxAge)
          return
        }

        // Split into chunks
        const chunks = Math.ceil(value.length / CHUNK_SIZE)
        console.log(`[Image Auth] Splitting ${name} into ${chunks} chunks`)
        
        for (let i = 0; i < chunks; i++) {
          const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
          setCookieRaw(`${name}.${i}`, chunk, maxAge)
        }
      },

      remove(name: string) {
        // Remove single cookie
        removeCookieRaw(name)

        // Remove any chunks
        let i = 0
        while (getCookie(`${name}.${i}`)) {
          removeCookieRaw(`${name}.${i}`)
          i++
        }
      }
    }
  })

  return clientInstance
}
