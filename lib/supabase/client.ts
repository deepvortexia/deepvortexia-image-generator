// lib/supabase/client.ts
// Version partagée — session valide sur tous les sous-domaines *.deepvortexai.art

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

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

      // ✅ Utiliser les cookies avec le domaine parent
      // pour partager la session entre tous les sous-domaines
      storage: createCookieStorage(),
      storageKey: 'deepvortex-auth', // même clé partout
    },
  })

  return clientInstance
}

// Storage personnalisé basé sur les cookies (partagé entre sous-domaines)
function createCookieStorage() {
  return {
    getItem: (key: string): string | null => {
      if (typeof document === 'undefined') return null
      const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'))
      if (match) {
        try {
          return decodeURIComponent(match[2])
        } catch {
          return null
        }
      }
      return null
    },

    setItem: (key: string, value: string): void => {
      if (typeof document === 'undefined') return
      const maxAge = 60 * 60 * 24 * 7 // 7 jours
      // domain=.deepvortexai.art → partagé entre tous les sous-domaines
      document.cookie = `${key}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; domain=.deepvortexai.art; SameSite=Lax; Secure`
    },

    removeItem: (key: string): void => {
      if (typeof document === 'undefined') return
      // Supprimer sur le domaine parent pour effacer partout
      document.cookie = `${key}=; max-age=0; path=/; domain=.deepvortexai.art; SameSite=Lax; Secure`
    },
  }
}
