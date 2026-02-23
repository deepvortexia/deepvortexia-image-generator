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

  const handleStyleSelect = (s: string) => setUserPrompt(p => (p + " " + s).trim());
      const handleIdeaSelect = (idea: string) => setUserPrompt(idea);

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
                    const v = ['Starter', 'Basic', 'Popular', 'Pro', 'Ultimate'];
                    if (v.includes(buy)) {
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
                    const { data: { session: s } } = await supabase.auth.getSession();
                    if (!s?.access_token) {
                                setError('Please sign in to generate images.');
                                setIsGenerating(false);
                                return;
                    }
                    const res = await fetch('/api/generate', {
                                method: 'POST',
                                headers: {
                                              'Content-Type': 'application/json',
                                              'Authorization': 'Bearer ' + s.access_token,
                                },
                                body: JSON.stringify({ prompt: userPrompt, aspectRatio }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Failed to generate image');
                    setImageUrl(data.imageUrl);
                    setImageId(data.imageId || null);
                    await refreshProfile();
          } catch (err: any) {
                    setError(err.message);
          } finally {
                    setIsGenerating(false);
          }
  };

  return (
          <div className="min-h-screen bg-black text-white font-sans pb-10">
                <Header buyPack={buyPack} onBuyPackHandled={() => setBuyPack(null)} />
                <main className="max-w-[1200px] mx-auto px-3 sm:px-5 flex flex-col gap-4 sm:gap-8">
                        <div className="flex flex-col gap-3 sm:gap-5 w-full max-w-[800px] mx-auto mt-3 sm:mt-5">
                                  <CompactSuggestions onStyleSelect={handleStyleSelect} onIdeaSelect={handleIdeaSelect} />
                                  <PromptSection
                                                  prompt={userPrompt}
                                                  onPromptChange={setUserPrompt}
                                                  aspectRatio={aspectRatio}
                                                  onAspectRatioChange={setAspectRatio}
                                                  onGenerate={handleGenerate}
                                                  isLoading={isGenerating}
                                                />
                        </div>div>
                        <ImageDisplay
                                      imageUrl={imageUrl}
                                      isLoading={isGenerating}
                                      error={error}
                                      imageId={imageId}
                                      onRegenerate={handleGenerate}
                                    />
                        <EcosystemCards />
                </main>main>
          </div>div>
        );
}

export default function Home() {
      return (
              <Suspense fallback={<div className="min-h-screen bg-black" />}>
                    <HomeContent />
              </Suspense>Suspense>
            );
}
</div>
