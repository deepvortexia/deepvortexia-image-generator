// lib/supabase/client.ts  (Image Generator — Next.js)
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

// 🌉 CRÉATION DU PONT MAGIQUE (Cookie partagé)
const customCookieStorage = {
  getItem: (key: string) => {
    if (typeof document === 'undefined') return null; // Sécurité pour Next.js (SSR)
    const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (key: string, value: string) => {
    if (typeof document === 'undefined') return;
    // Le '.deepvortexai.art' autorise le Hub, Images, et Emoticons à lire la session
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
      storageKey: 'deepvortex-auth', // ⚠️ Identique sur les 3 sites !
      storage: customCookieStorage,  // 👈 On active le partage de session ici
    },
  })

  return clientInstance
}
