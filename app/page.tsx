"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ToolsPreview from "@/components/ToolsPreview";
import CreditsDisplay from "@/components/CreditsDisplay";
import PromptInput from "@/components/PromptInput";
import AspectRatioSelector from "@/components/AspectRatioSelector";
import StyleSuggestions from "@/components/StyleSuggestions";
import QuickIdeas from "@/components/QuickIdeas";
import GenerateButton from "@/components/GenerateButton";
import ImageDisplay from "@/components/ImageDisplay";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError("");
    setImageUrl("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStyleSelect = (style: string) => {
    setPrompt(prev => prev ? `${prev}, ${style}` : style);
  };

  return (
    <div className="app min-h-screen" style={{ background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Floating Particles */}
      <div className="particles">
        <div className="particle" style={{ left: '10%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ left: '20%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ left: '30%', animationDelay: '4s' }}></div>
        <div className="particle" style={{ left: '40%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ left: '50%', animationDelay: '3s' }}></div>
        <div className="particle" style={{ left: '60%', animationDelay: '5s' }}></div>
        <div className="particle" style={{ left: '70%', animationDelay: '2.5s' }}></div>
        <div className="particle" style={{ left: '80%', animationDelay: '4.5s' }}></div>
        <div className="particle" style={{ left: '90%', animationDelay: '1.5s' }}></div>
      </div>

      {/* TODO: Replace hardcoded credits with dynamic value from user profile/API */}
      <Header 
        credits={439}
        onSignIn={() => console.log('Sign in clicked')}
        onFavorites={() => console.log('Favorites clicked')}
      />
      
      <ToolsPreview />
      
      <CreditsDisplay 
        credits={439}
        onBuyCredits={() => console.log('Buy credits clicked')}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: 'var(--gold-primary)',
              letterSpacing: '0.1em',
              textShadow: '0 0 20px var(--glow-gold)'
            }}
          >
            AI IMAGE GENERATOR
          </h1>
          <p 
            className="text-lg"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: 'var(--gold-primary)',
              fontWeight: 600
            }}
          >
            Create stunning images from text with AI
          </p>
        </div>

        <PromptInput value={prompt} onChange={setPrompt} disabled={isLoading} />
        
        <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
        
        <StyleSuggestions onSelect={handleStyleSelect} />
        
        <QuickIdeas onSelect={setPrompt} />
        
        <GenerateButton onClick={handleGenerate} isLoading={isLoading} disabled={!prompt.trim()} />
        
        <ImageDisplay 
          imageUrl={imageUrl}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}
