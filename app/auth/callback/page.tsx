'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
        const supabase = createClient();
        if (!supabase) {
                setError('Authentication service not configured');
                return;
        }

                // Handle PKCE flow: exchange code for session
                const handleCallback = async () => {
                        const url = new URL(window.location.href);
                        const code = url.searchParams.get('code');
                        const errorParam = url.searchParams.get('error');
                        const errorDescription = url.searchParams.get('error_description');

                        // Handle error from OAuth provider
                        if (errorParam) {
                                  console.error('OAuth error:', errorParam, errorDescription);
                                  setError(errorDescription || errorParam);
                                  setTimeout(() => router.push('/'), 3000);
                                  return;
                        }

                        // PKCE flow: exchange authorization code for session
                        if (code) {
                                  try {
                                              const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
                                              if (exchangeError) {
                                                            console.error('Code exchange error:', exchangeError);
                                                            // Don't show error - session might already exist
                                              }
                                  } catch (err) {
                                              console.error('Exchange exception:', err);
                                  }
                        }

                        // Check if session exists (works for both PKCE and implicit flow)
                        const { data } = await supabase.auth.getSession();
                        if (data.session) {
                                  router.push('/');
                                  return;
                        }

                        // Listen for auth state change (implicit flow with hash fragment)
                        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                                  if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
                                              subscription.unsubscribe();
                                              router.push('/');
                                  }
                        });

                        // Safety timeout
                        const timeout = setTimeout(() => {
                                  subscription.unsubscribe();
                                  router.push('/');
                        }, 5000);

                        return () => {
                                  clearTimeout(timeout);
                                  subscription.unsubscribe();
                        };
                };

                handleCallback();
  }, [router]);

  if (error) {
        return (
                <div className="min-h-screen flex items-center justify-center bg-black">
                        <div className="max-w-md w-full p-8 bg-gray-900 rounded-lg border border-red-500/20 text-center">
                                  <div className="mb-4 text-red-500 text-5xl">⚠️</div>div>
                                  <h1 className="text-2xl font-bold text-white mb-4">Sign In Failed</h1>h1>
                                  <p className="text-gray-300 mb-6">{error}</p>p>
                                  <a
                                                href="/"
                                                className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                              >
                                              Return to Home
                                  </a>a>
                        </div>div>
                </div>div>
              );
  }
  
    return (
          <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                        <div className="mb-4">
                                  <div className="inline-block w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>div>
                        </div>div>
                        <p className="text-gray-300 text-lg">Completing sign in...</p>p>
                </div>div>
          </div>div>
        );
}
</div>
