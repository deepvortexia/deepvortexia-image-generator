'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * This hook has been gutted to remove free generations.
 * Now it only provides auth state and always requires login to generate.
 */
export function useFreeGenerations() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const { user, loading } = useAuth();
  
  // Derive isLoggedIn from auth context
  const isLoggedIn = !loading && !!user;

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
  }, []);

  // Always return false for non-logged-in users
  const useFreeGeneration = (): boolean => {
    return isLoggedIn;
  };

  // No-op restore function
  const restoreFreeGeneration = (): void => {
    // No-op: free generations removed
  };

  return {
    freeGenerationsLeft: 0, // Always 0 - no free generations
    isLoggedIn,
    canGenerate: isLoggedIn, // Can only generate if logged in
    useFreeGeneration,
    restoreFreeGeneration,
    isClient,
  };
}
