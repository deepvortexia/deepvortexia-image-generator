"use client";

import React, { useState } from 'react';
import EcosystemCards from '../components/EcosystemCards';
import Header from '../components/Header';
import CompactSuggestions from '../components/CompactSuggestions';
import PromptSection from '../components/PromptSection';
import GenerateButton from '../components/GenerateButton';
import AspectRatioSelector from '../components/AspectRatioSelector';
import ImageDisplay from '../components/ImageDisplay';

// --- BANNIÈRE STYLE SÉCURISÉ (Inline Styles) ---
const LocalSignBanner = () => (
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
    textTransform: 'uppercase'
  }}>
    ✨ Sign up and get 2 credits free ✨
  </div>
);

export default function Home() {
  // Ces fonctions sont nécessaires pour calmer l'erreur TypeScript
  // Plus tard, on pourra les relier au PromptSection pour écrire le texte automatiquement
  const handleStyleSelect = (style: string) => {
    console.log("Style selected:", style);
  };

  const handleIdeaSelect = (idea: string) => {
    console.log("Idea selected:", idea);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-10" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 1) 70%)' }}>
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-5 flex flex-col gap-8">
        {/* 1. GÉNÉRATEUR EN HAUT */}
        <div className="flex flex-col gap-5 w-full max-w-[800px] mx-auto mt-5">
          {/* CORRECTION ICI : On passe les fonctions obligatoires */}
          <CompactSuggestions 
            onStyleSelect={handleStyleSelect} 
            onIdeaSelect={handleIdeaSelect} 
          />
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
