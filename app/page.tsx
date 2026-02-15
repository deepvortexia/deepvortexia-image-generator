"use client";

import React, { useState, useEffect, Suspense } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const handleStyleSelect = (style: string) => setUserPrompt((prev) => `${prev} ${style}`.trim());
  const handleIdeaSelect = (idea: string) => setUserPrompt(idea);

  // Handle success redirect from Stripe checkout
  useEffect(() => {
    if (!searchParams) return;
    const success = searchParams.get('success');
    if (success === 'true') {
      // Refresh profile to pick up newly purchased credits
      refreshProfile();
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams, refreshProfile]);

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setImageUrl(null);

    try {
      // Get current session for auth token
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
        body: JSON.stringify({ 
          prompt: userPrompt, 
          aspectRatio: aspectRatio 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.imageUrl);
      // Immediately refresh profile to update credit count in header
      await refreshProfile();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-10" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 1) 70%)' }}>
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-3 sm:px-5 flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col gap-3 sm:gap-5 w-full max-w-[800px] mx-auto mt-3 sm:mt-5">
          
          <CompactSuggestions 
            onStyleSelect={handleStyleSelect} 
            onIdeaSelect={handleIdeaSelect} 
          />

          <PromptSection 
            prompt={userPrompt}
            onPromptChange={setUserPrompt}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            onGenerate={handleGenerate}
            isLoading={isGenerating}
          />
        </div>

        <ImageDisplay 
          imageUrl={imageUrl} 
          isLoading={isGenerating} 
          error={error}
          prompt={userPrompt}
          onRegenerate={handleGenerate}
        />
        
        <EcosystemCards />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white font-sans pb-10" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 1) 70%)' }}>
        <Header />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
