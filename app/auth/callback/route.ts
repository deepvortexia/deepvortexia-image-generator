import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const STORAGE_KEY = 'deepvortex-auth'
const CHUNK_SIZE = 3000

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (errorParam) {
    const errorMsg = encodeURIComponent(errorDescription || errorParam)
    return NextResponse.redirect(`${origin}?auth_error=${errorMsg}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(`${origin}?auth_error=Configuration+error`)
  }

  const cookieStore = cookies()

  // Helper to get chunked cookie
  const getChunkedCookie = (name: string): string | undefined => {
    const single = cookieStore.get(name)?.value
    if (single) return single

    let result = ''
    let index = 0
    while (true) {
      const chunk = cookieStore.get(`${name}.${index}`)?.value
      if (!chunk) break
      result += chunk
      index++
    }
    return result || undefined
  }

  const response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const allCookies = cookieStore.getAll()
        const result: { name: string; value: string }[] = []
        const processedBases = new Set<string>()

        for (const cookie of allCookies) {
          const chunkMatch = cookie.name.match(/^(.+)\.(\d+)$/)
          if (chunkMatch) {
            const baseName = chunkMatch[1]
            if (!processedBases.has(baseName)) {
              processedBases.add(baseName)
              const fullValue = getChunkedCookie(baseName)
              if (fullValue) {
                result.push({ name: baseName, value: fullValue })
              }
            }
          } else if (!processedBases.has(cookie.name)) {
            result.push(cookie)
          }
        }

        // Map shared key to what Supabase expects
        const sharedAuth = getChunkedCookie(STORAGE_KEY)
        if (sharedAuth) {
          const projectId = supabaseUrl.match(/sb-([^.]+)/)?.[1] || ''
          const supabaseKey = `sb-${projectId}-auth-token`
          if (!result.find(c => c.name === supabaseKey)) {
            result.push({ name: supabaseKey, value: sharedAuth })
          }
        }

        // Also map code-verifier: check both naming conventions
        // The Vite apps store it as: deepvortex-auth-code-verifier
        // The middleware maps it as: deepvortex-auth-token-code-verifier
        // Supabase looks for: sb-{projectId}-auth-token-code-verifier
        const projectId = supabaseUrl.match(/sb-([^.]+)/)?.[1] || ''
        const supabaseVerifierKey = `sb-${projectId}-auth-token-code-verifier`
        
        if (!result.find(c => c.name === supabaseVerifierKey)) {
          // Try the shared key naming convention first
          const mappedVerifier = getChunkedCookie(`${STORAGE_KEY}-code-verifier`)
          if (mappedVerifier) {
            result.push({ name: supabaseVerifierKey, value: mappedVerifier })
          } else {
            // Try the middleware-mapped name
            const altVerifier = getChunkedCookie(`${STORAGE_KEY}-token-code-verifier`)
            if (altVerifier) {
              result.push({ name: supabaseVerifierKey, value: altVerifier })
            }
          }
        }

        return result
      },

      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieOptions = {
            ...options,
            domain: '.deepvortexai.art',
            path: '/',
            sameSite: 'lax' as const,
            secure: true,
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 365,
          }

          // Map Supabase's cookie to our shared key
          let targetName = name
          if (name.startsWith('sb-') && name.endsWith('-auth-token')) {
            targetName = STORAGE_KEY
          } else if (name.includes('code-verifier')) {
            targetName = `${STORAGE_KEY}-code-verifier`
          }

          // Handle chunking
          if (value.length <= CHUNK_SIZE) {
            response.cookies.set(targetName, value, cookieOptions)
          } else {
            const chunks = Math.ceil(value.length / CHUNK_SIZE)
            for (let i = 0; i < chunks; i++) {
              const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
              response.cookies.set(`${targetName}.${i}`, chunk, cookieOptions)
            }
          }

          // If this is a code-verifier being cleared (empty value), also clean up alt names
          if (name.includes('code-verifier') && !value) {
            response.cookies.set(`${STORAGE_KEY}-code-verifier`, '', { ...cookieOptions, maxAge: 0 })
            response.cookies.set(`${STORAGE_KEY}-token-code-verifier`, '', { ...cookieOptions, maxAge: 0 })
          }
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[Auth Callback] Exchange error:', error.message)
    const errorMsg = encodeURIComponent(
      error.message.includes('code verifier')
        ? 'Session expired. Please try signing in again.'
        : error.message
    )
    return NextResponse.redirect(`${origin}?auth_error=${errorMsg}`)
  }

  return response
}
