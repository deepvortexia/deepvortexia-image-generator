"use client";

import { useState } from "react";
import Header from "@/components/Header";
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
    <div className="min-h-screen bg-black text-white">
      <Header credits={439} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
            AI Image Generator
          </h1>
          <p className="text-gray-400">
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
