'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      setError('Authentication service not configured');
      return;
    }

    const handleCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const errorParam = url.searchParams.get('error');

      if (errorParam) {
        setError(errorParam);
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
        router.push('/');
        return;
      }

      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setError(sessionError.message);
          return;
        }
        if (data?.session) {
          router.push('/');
          return;
        }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          if (event === 'SIGNED_IN' && session) {
            subscription.unsubscribe();
            router.push('/');
          }
        }
      );

      setTimeout(() => {
        subscription.unsubscribe();
        router.push('/');
      }, 5000);
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full p-8 bg-gray-900 rounded-lg border border-red-500/20 text-center">
          <div className="mb-4 text-red-500 text-5xl">\u26A0</div>
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Failed</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
