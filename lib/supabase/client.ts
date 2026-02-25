// lib/supabase/client.ts (Image Generator — Next.js)
import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null
const CHUNK_SIZE = 3000

// The shared cookie key used across all 3 sites
const STORAGE_KEY = 'deepvortex-auth'

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

const setCookieRaw = (name: string, value: string, maxAge: number = 31536000) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; domain=.deepvortexai.art; path=/; max-age=${maxAge}; secure; samesite=lax`
}

const removeCookieRaw = (name: string) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; domain=.deepvortexai.art; path=/; max-age=0; secure; samesite=lax`
}

// Get chunked or single cookie value
const getChunkedCookie = (name: string): string | undefined => {
  const singleValue = getCookie(name)
  if (singleValue) return singleValue

  let result = ''
  let index = 0
  while (true) {
    const chunk = getCookie(`${name}.${index}`)
    if (!chunk) break
    result += chunk
    index++
  }
  return result || undefined
}

// Set chunked cookie
const setChunkedCookie = (name: string, value: string, maxAge: number = 31536000) => {
  // Remove existing
  let i = 0
  while (getCookie(`${name}.${i}`)) { removeCookieRaw(`${name}.${i}`); i++ }
  removeCookieRaw(name)

  if (value.length <= CHUNK_SIZE) {
    setCookieRaw(name, value, maxAge)
    return
  }

  const chunks = Math.ceil(value.length / CHUNK_SIZE)
  for (let i = 0; i < chunks; i++) {
    const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    setCookieRaw(`${name}.${i}`, chunk, maxAge)
  }
}

// Remove chunked cookie
const removeChunkedCookie = (name: string) => {
  removeCookieRaw(name)
  let i = 0
  while (getCookie(`${name}.${i}`)) { removeCookieRaw(`${name}.${i}`); i++ }
}

export function createClient() {
  if (clientInstance) return clientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    if (process.env.NODE_ENV === 'development') console.warn('⚠️ Supabase configuration missing')
    return null as any
  }

  clientInstance = createBrowserClient(url, key, {
    cookies: {
      get(name: string) {
        // Map Supabase's default cookie name to our shared key
        if (name.startsWith('sb-') && name.endsWith('-auth-token')) {
          const value = getChunkedCookie(STORAGE_KEY)
          if (value) return value
        }
        // Map code-verifier to consistent shared name
        // Supabase looks for: sb-{projectId}-auth-token-code-verifier
        // We store it as: deepvortex-auth-code-verifier (consistent with Vite apps)
        if (name.includes('code-verifier')) {
          const sharedName = `${STORAGE_KEY}-code-verifier`
          const value = getChunkedCookie(sharedName)
          if (value) return value
          // Fallback: check the old mapped name too
          const oldMapped = name.replace(/sb-[^-]+-auth/, STORAGE_KEY)
          const oldValue = getChunkedCookie(oldMapped)
          if (oldValue) return oldValue
          // Last resort: check original name
          return getChunkedCookie(name)
        }
        return getChunkedCookie(name)
      },

      set(name: string, value: string, options?: { maxAge?: number }) {
        const maxAge = options?.maxAge || 31536000
        
        // Map Supabase's default cookie name to our shared key
        if (name.startsWith('sb-') && name.endsWith('-auth-token')) {
          setChunkedCookie(STORAGE_KEY, value, maxAge)
          return
        }
        // Map code-verifier to consistent shared name
        if (name.includes('code-verifier')) {
          const sharedName = `${STORAGE_KEY}-code-verifier`
          setChunkedCookie(sharedName, value, maxAge)
          return
        }
        setChunkedCookie(name, value, maxAge)
      },

      remove(name: string) {
        // Map Supabase's default cookie name to our shared key
        if (name.startsWith('sb-') && name.endsWith('-auth-token')) {
          removeChunkedCookie(STORAGE_KEY)
          return
        }
        if (name.includes('code-verifier')) {
          // Clean up ALL possible code-verifier names
          removeChunkedCookie(`${STORAGE_KEY}-code-verifier`)
          // Also clean up old mapped name in case it exists
          const oldMapped = name.replace(/sb-[^-]+-auth/, STORAGE_KEY)
          if (oldMapped !== `${STORAGE_KEY}-code-verifier`) {
            removeChunkedCookie(oldMapped)
          }
          return
        }
        removeChunkedCookie(name)
      }
    }
  })

  return clientInstance
}
