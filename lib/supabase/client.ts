// lib/supabase/client.ts (Image Generator — Next.js)
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

// 🌉 Cookie partagé cross-domaine — même clé sur les 3 sites
const customCookieStorage = {
    getItem: (key: string) => {
          if (typeof document === 'undefined') return null;
          const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
          return match ? decodeURIComponent(match[2]) : null;
    },
    setItem: (key: string, value: string) => {
          if (typeof document === 'undefined') return;
          document.cookie = `${key}=${encodeURIComponent(value)}; domain=.deepvortexai.art; path=/; max-age=31536000; secure; samesite=lax`;
    },
    removeItem: (key: string) => {
          if (typeof document === 'undefined') return;
          document.cookie = `${key}=; domain=.deepvortexai.art; path=/; max-age=0; secure; samesite=lax`;
    }
};

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
                  flowType: 'pkce',          // ✅ PKCE est le standard moderne et sécurisé
                  storageKey: 'deepvortex-auth', // ⚠️ Identique sur les 3 sites !
                  storage: customCookieStorage,  // 👈 Partage de session cross-domaine
          },
    })

    return clientInstance
}
