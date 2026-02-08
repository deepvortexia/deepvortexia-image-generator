'use client';

import { useState, useEffect } from 'react';

const FREE_GENERATIONS_KEY = 'deepvortex_free_generations';
const INITIAL_FREE_GENERATIONS = 2;

export function useFreeGenerations() {
  const [freeGenerationsLeft, setFreeGenerationsLeft] = useState<number>(INITIAL_FREE_GENERATIONS);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

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

    // TODO: Check actual login status from your auth system
    // For now, assume not logged in
    // setIsLoggedIn(checkAuthStatus());
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

  const canGenerate = isLoggedIn || freeGenerationsLeft > 0;

  return {
    freeGenerationsLeft,
    isLoggedIn,
    canGenerate,
    useFreeGeneration,
    isClient,
  };
}
