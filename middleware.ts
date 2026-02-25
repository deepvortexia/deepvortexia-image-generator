import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const CHUNK_SIZE = 3000

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookies = request.cookies.getAll()
        const result: { name: string; value: string }[] = []
        const chunkedCookies: { [key: string]: { [index: number]: string } } = {}

        // Separate single cookies from chunked ones
        for (const cookie of cookies) {
          const chunkMatch = cookie.name.match(/^(.+)\.(\d+)$/)
          if (chunkMatch) {
            const baseName = chunkMatch[1]
            const index = parseInt(chunkMatch[2], 10)
            if (!chunkedCookies[baseName]) {
              chunkedCookies[baseName] = {}
            }
            chunkedCookies[baseName][index] = cookie.value
          } else {
            result.push(cookie)
          }
        }

        // Reassemble chunked cookies
        for (const [baseName, chunks] of Object.entries(chunkedCookies)) {
          const indices = Object.keys(chunks).map(Number).sort((a, b) => a - b)
          let value = ''
          for (const idx of indices) {
            value += chunks[idx]
          }
          if (value) {
            result.push({ name: baseName, value })
          }
        }

        return result
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        
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

          // Remove existing chunks
          let i = 0
          while (request.cookies.get(`${name}.${i}`)) {
            supabaseResponse.cookies.set(`${name}.${i}`, '', { ...cookieOptions, maxAge: 0 })
            i++
          }

          // If value is small enough, store as single cookie
          if (value.length <= CHUNK_SIZE) {
            supabaseResponse.cookies.set(name, value, cookieOptions)
            return
          }

          // Split into chunks
          const chunks = Math.ceil(value.length / CHUNK_SIZE)
          for (let i = 0; i < chunks; i++) {
            const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
            supabaseResponse.cookies.set(`${name}.${i}`, chunk, cookieOptions)
          }
        })
      },
    },
  })

  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
