import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  console.log('🔐 Auth callback triggered:', { 
    hasCode: !!code, 
    error, 
    error_description 
  })

  if (error) {
    console.error('❌ Auth callback error:', error, error_description)
    return NextResponse.redirect(`${requestUrl.origin}?error=${error}`)
  }

  if (code) {
    const supabase = await createClient()
    
    if (!supabase) {
      console.error('❌ Supabase client not configured')
      return NextResponse.redirect(`${requestUrl.origin}?error=config_missing`)
    }

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('❌ Failed to exchange code for session:', exchangeError.message)
        return NextResponse.redirect(`${requestUrl.origin}?error=exchange_failed`)
      }

      console.log('✅ Successfully exchanged code for session:', data.user?.email)
    } catch (error) {
      console.error('❌ Exception during code exchange:', error)
      return NextResponse.redirect(`${requestUrl.origin}?error=exception`)
    }
  } else {
    console.warn('⚠️ No code parameter in callback URL')
  }

  // Redirect to origin
  return NextResponse.redirect(requestUrl.origin)
}
