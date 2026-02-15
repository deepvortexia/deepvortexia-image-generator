"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Importé pour la bannière cliquable
import EcosystemCards from '../components/EcosystemCards';
import Header from '../components/Header';
import CompactSuggestions from '../components/CompactSuggestions';
import PromptSection from '../components/PromptSection';
import GenerateButton from '../components/GenerateButton';
import AspectRatioSelector from '../components/AspectRatioSelector';
import ImageDisplay from '../components/ImageDisplay';

// --- BANNIÈRE CLIQUABLE ---
const LocalSignBanner = () => (
  <Link href="/auth" style={{ textDecoration: 'none' }}>
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '40px auto 20px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '12px',
      background: 'rgba(212, 175, 55, 0.05)',
      color: '#D4AF37',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'}
    >
      ✨ Sign up and get 2 credits free ✨
    </div>
  </Link>
);

export default function Home() {
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStyleSelect = (style: string) => setUserPrompt((prev) => `${prev} ${style}`.trim());
  const handleIdeaSelect = (idea: string) => setUserPrompt(idea);

  const handleGenerate = () => {
    if (!userPrompt.trim()) return;
    setIsGenerating(true);
    // Simulation de délai pour le visuel
    setTimeout(() => setIsGenerating(false), 3000);
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

          {/* RÉPARATION DES 3 PROPS MANQUANTES */}
          <PromptSection 
            prompt={userPrompt}
            onPromptChange={setUserPrompt}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio} // Prop manquante 1
            onGenerate={handleGenerate}          // Prop manquante 2
            isLoading={isGenerating}             // Prop manquante 3
          />

          <GenerateButton 
            onClick={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        <ImageDisplay />
        <LocalSignBanner />

        <div className="mt-16 border-t border-[#d4af37]/10 pt-10">
          <EcosystemCards />
        </div>
      </main>
    </div>
  );
}
