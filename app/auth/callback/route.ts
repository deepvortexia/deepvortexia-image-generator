import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('🔄 Auth callback triggered', { 
    hasCode: !!code, 
    hasError: !!error,
    origin: requestUrl.origin 
  })

  // Handle OAuth errors
  if (error) {
    console.error('❌ OAuth error:', error, errorDescription)
    // Redirect with error parameter so UI can show message
    return NextResponse.redirect(`${requestUrl.origin}?auth_error=${encodeURIComponent(error)}`)
  }

  if (code) {
    try {
      const supabase = await createClient()
      console.log('🔐 Exchanging code for session...')
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('❌ Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(`${requestUrl.origin}?auth_error=${encodeURIComponent(exchangeError.message)}`)
      }
      
      if (data?.session) {
        console.log('✅ Session established for user:', data.session.user.email)
      }
    } catch (error: any) {
      console.error('❌ Auth callback error:', error)
      // Redirect with error parameter
      return NextResponse.redirect(`${requestUrl.origin}?auth_error=${encodeURIComponent(error.message || 'Authentication failed')}`)
    }
  } else {
    console.log('⚠️ No code provided in auth callback')
  }

  // URL to redirect to after sign in process completes
  console.log('↩️ Redirecting to:', requestUrl.origin)
  return NextResponse.redirect(requestUrl.origin)
}
