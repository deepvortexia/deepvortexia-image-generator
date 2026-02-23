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
          await refreshProfile();
          setTimeout(async () => { await refreshProfile(); }, 2000);
          setTimeout(async () => { await refreshProfile(); }, 5000);
    }, [refreshProfile]);

    useEffect(() => {
          if (!searchParams) return;
          const success = searchParams.get('success');
          const buy = searchParams.get('buy');
          if (success === 'true') {
                  refreshWithRetry();
                  window.history.replaceState({}, '', '/');
          }
          if (buy) {
                  const validPacks = ['Starter', 'Basic', 'Popular', 'Pro', 'Ultimate'];
                  if (validPacks.includes(buy)) {
                            setBuyPack(buy);
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
                  const { data: { session: currentSession } } = await supabase.auth.getSession();
                  if (!currentSession?.access_token) {
                            setError('Please sign in to generate images.');
                            setIsGenerating(false);
                            return;
                  }
                  const response = await fetch('/api/generate', {
                            method: 'POST',
                            headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${currentSession.access_token}`,
                            },
                            body: JSON.stringify({ prompt: userPrompt, aspectRatio: aspectRatio }),
                  });
                  const data = await response.json();
                  if (!response.ok) {
                            throw new Error(data.error || 'Failed to generate image');
                  }
                  setImageUrl(data.imageUrl);
                  setImageId(data.imageId || null);
                  await refreshProfile();
          } catch (err: any) {
                  setError(err.message);
          } finally {
                  setIsGenerating(false);
          }
    };
