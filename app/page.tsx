"use client";

import React, { useState } from 'react';
import EcosystemCards from '../components/EcosystemCards';
import Header from '../components/Header';
import CompactSuggestions from '../components/CompactSuggestions';
import PromptSection from '../components/PromptSection';
import GenerateButton from '../components/GenerateButton';
import AspectRatioSelector from '../components/AspectRatioSelector';
import ImageDisplay from '../components/ImageDisplay';

export default function Home() {
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStyleSelect = (style: string) => setUserPrompt((prev) => `${prev} ${style}`.trim());
  const handleIdeaSelect = (idea: string) => setUserPrompt(idea);

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-10" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 1) 70%)' }}>
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-5 flex flex-col gap-8">
        <div className="flex flex-col gap-5 w-full max-w-[800px] mx-auto mt-5">
          
          <CompactSuggestions 
            onStyleSelect={handleStyleSelect} 
            onIdeaSelect={handleIdeaSelect} 
          />

          <AspectRatioSelector 
            value={aspectRatio} 
            onChange={setAspectRatio} 
          />

          <PromptSection 
            prompt={userPrompt}
            onPromptChange={setUserPrompt}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            onGenerate={handleGenerate}
            isLoading={isGenerating}
          />

          <GenerateButton 
            onClick={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* RÉPARATION FINALE : Conversion null vers "" */}
        <ImageDisplay 
          imageUrl={imageUrl || ""} 
          isLoading={isGenerating} 
          error={error} 
        />
        
        <EcosystemCards />
      </main>
    </div>
  );
}
