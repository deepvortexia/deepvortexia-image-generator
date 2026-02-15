"use client";

import React from 'react';
import EcosystemCards from '../components/EcosystemCards';
import Header from '../components/Header';
import CompactSuggestions from '../components/CompactSuggestions';
import PromptSection from '../components/PromptSection';
import GenerateButton from '../components/GenerateButton';
import AspectRatioSelector from '../components/AspectRatioSelector';
import ImageDisplay from '../components/ImageDisplay';

// --- BANNIÈRE INTÉGRÉE ---
const LocalSignBanner = () => (
  <div className="w-full max-w-2xl mx-auto mt-10 mb-5 p-5 text-center border border-[#d4af37]/30 rounded-xl bg-[#d4af37]/5 backdrop-blur-sm animate-pulse">
    <span className="font-orbitron text-[#d4af37] text-lg font-bold tracking-wider uppercase">
      ✨ Sign up and get 2 credits free ✨
    </span>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.1)_0%,rgba(10,10,10,1)_70%)] pb-10 text-white font-sans">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-5 flex flex-col gap-8">
        {/* 1. GÉNÉRATEUR EN HAUT */}
        <div className="flex flex-col gap-5 w-full max-w-[800px] mx-auto">
          <CompactSuggestions />
          <AspectRatioSelector />
          <PromptSection />
          <GenerateButton />
        </div>

        {/* 2. IMAGE GÉNÉRÉE */}
        <ImageDisplay />
        
        {/* 3. BANNIÈRE */}
        <LocalSignBanner />

        {/* 4. ÉCOSYSTÈME EN BAS */}
        <div className="mt-16 border-t border-[#d4af37]/10 pt-10">
          <EcosystemCards />
        </div>
      </main>
    </div>
  );
}
