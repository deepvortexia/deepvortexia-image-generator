import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - handle errors gracefully
  try {
    const { error } = await supabase.auth.getSession()
    
    if (error) {
      // Handle expected refresh token errors gracefully
      if (error.message?.includes('refresh_token_not_found') || 
          error.code === 'refresh_token_not_found') {
        console.warn('⚠️ Middleware: Invalid refresh token detected')
        await supabase.auth.signOut({ scope: 'local' })
        console.log('✅ Cleared invalid refresh token')
      } else {
        // Log other auth errors as they may indicate security or system issues
        console.error('❌ Unexpected auth error in middleware:', error.message, error.code)
      }
    }
  } catch (err) {
    // Log unexpected exceptions separately
    console.error('❌ Critical error in middleware auth:', err)
    // Continue despite errors to avoid blocking requests
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
