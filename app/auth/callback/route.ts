import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('🔄 Auth callback triggered', { hasCode: !!code, origin: requestUrl.origin })

  if (code) {
    try {
      const supabase = await createClient()
      console.log('🔐 Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error exchanging code for session:', error)
        throw error
      }
      
      if (data?.session) {
        console.log('✅ Session established for user:', data.session.user.email)
      }
    } catch (error) {
      console.error('❌ Auth callback error:', error)
      // Continue to redirect even if there's an error
    }
  } else {
    console.log('⚠️ No code provided in auth callback')
  }

  // URL to redirect to after sign in process completes
  console.log('↩️ Redirecting to:', requestUrl.origin)
  return NextResponse.redirect(requestUrl.origin)
}
