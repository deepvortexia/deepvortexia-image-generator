'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';

const FREE_GENERATIONS_KEY = 'deepvortex_free_generations';
const INITIAL_FREE_GENERATIONS = 2;

export function useFreeGenerations() {
  const [freeGenerationsLeft, setFreeGenerationsLeft] = useState<number>(INITIAL_FREE_GENERATIONS);
  const [isClient, setIsClient] = useState<boolean>(false);
  const { user, loading } = useAuth();
  
  // Derive isLoggedIn from auth context
  const isLoggedIn = !loading && !!user;

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    // Load from localStorage
    const saved = localStorage.getItem(FREE_GENERATIONS_KEY);
    if (saved !== null) {
      const parsedValue = parseInt(saved, 10);
      if (!isNaN(parsedValue)) {
        setFreeGenerationsLeft(parsedValue);
      }
    }
  }, []);

  const useFreeGeneration = (): boolean => {
    if (isLoggedIn) {
      // For logged-in users, handle credit deduction separately
      return true;
    }

    if (freeGenerationsLeft <= 0) {
      return false; // No free generations left
    }

    const newCount = freeGenerationsLeft - 1;
    setFreeGenerationsLeft(newCount);
    if (isClient) {
      localStorage.setItem(FREE_GENERATIONS_KEY, newCount.toString());
    }
    return true;
  };

  const restoreFreeGeneration = (): void => {
    if (!isLoggedIn && freeGenerationsLeft < INITIAL_FREE_GENERATIONS) {
      const newCount = freeGenerationsLeft + 1;
      setFreeGenerationsLeft(newCount);
      if (isClient) {
        localStorage.setItem(FREE_GENERATIONS_KEY, newCount.toString());
      }
    }
  };

  // Compute canGenerate dynamically
  const canGenerate = useMemo(() => {
    return isLoggedIn || freeGenerationsLeft > 0;
  }, [isLoggedIn, freeGenerationsLeft]);

  return {
    freeGenerationsLeft,
    isLoggedIn,
    canGenerate,
    useFreeGeneration,
    restoreFreeGeneration,
    isClient,
  };
}
