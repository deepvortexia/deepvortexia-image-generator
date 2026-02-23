"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import EcosystemCards from '../components/EcosystemCards';
import Header from '../components/Header';
import CompactSuggestions from '../components/CompactSuggestions';
import PromptSection from '../components/PromptSection';
import ImageDisplay from '../components/ImageDisplay';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

function HomeContent() {
    const { refreshProfile } = useAuth();
    const supabase = createClient();
    const searchParams = useSearchParams();

  const [aspectRatio, setAspectRatio] = useState("1:1");
    const [userPrompt, setUserPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageId, setImageId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [buyPack, setBuyPack] = useState<string | null>(null);

  const handleStyleSelect = (style: string) => setUserPrompt((prev) => `${prev} ${style}`.trim());
    const handleIdeaSelect = (idea: string) => setUserPrompt(idea);

  // Retry refreshProfile with delay to wait for Stripe webhook processing
  const refreshWithRetry = useCallback(async () => {
        // First attempt immediately
                                           await refreshProfile();
        // Retry after 2s in case webhook hasn't processed yet
                                           setTimeout(async () => {
                                                   await refreshProfile();
                                           }, 2000);
        // Final retry after 5s as safety net
                                           setTimeout(async () => {
                                                   await refreshProfile();
                                           }, 5000);
  }, [refreshProfile]);

  // Handle URL parameters (success from Stripe checkout and buy parameter from Hub)
  useEffect(() => {
        if (!searchParams) return;

                const success = searchParams.get('success');
        const buy = searchParams.get('buy');

                // Handle successful payment
                if (success === 'true') {
                        // Refresh profile with retries to pick up newly purchased credits
          refreshWithRetry();
                        // Clean up URL
          window.history.replaceState({}, '', '/');
                }

                // Handle buy parameter from Hub redirect
                if (buy) {
                        const validPacks = ['Starter', 'Basic', 'Popular', 'Pro', 'Ultimate'];
                        if (validPacks.includes(buy)) {
                                  setBuyPack(buy);
                                  // Clean up URL after setting the pack
                          window.history.replaceState({}, '', '/');
                        }
                }
  }, [searchParams, refreshWithRetry]);

  const handleGenerate = async () => {
        if (!userPrompt.trim()) return;

        setIsGenerating(true);
        setError(null);
        setImageUrl(null);
        setImageId(null);

        try {
                // Get current session for auth token
          const { data: { session: currentSession } } = await supabase.auth.getSession();

          if (!currentSession?.access_token) {
                    setError('Please sign in to generate images.');
              
