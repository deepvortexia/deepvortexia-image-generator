"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NavigationTabs from "@/components/NavigationTabs";
import FreeCreditsBanner from "@/components/FreeCreditsBanner";
import EcosystemCards from "@/components/EcosystemCards";
import CreditsDisplay from "@/components/CreditsDisplay";
import CompactSuggestions from "@/components/CompactSuggestions";
import PromptSection from "@/components/PromptSection";
import ImageDisplay from "@/components/ImageDisplay";
import { Notification } from "@/components/Notification";
import { AuthModal } from "@/components/AuthModal";
import { PricingModal } from "@/components/PricingModal";
import { useFreeGenerations } from "@/hooks/useFreeGenerations";
import { useCredits } from "@/hooks/useCredits";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  
  const { isLoggedIn } = useFreeGenerations();
  const { hasCredits, refreshProfile } = useCredits();
  const { user, loading: authLoading } = useAuth();

  // Handle ?buy=PACK_NAME URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const buyParam = params.get('buy');
    
    if (buyParam && !authLoading) {
      if (user) {
        // User is logged in, open pricing modal
        setShowPricingModal(true);
        // Clean the URL
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        // User not logged in, open auth modal first
        setShowAuthModal(true);
        // After auth, we'll check again and open pricing modal
      }
    }
  }, [user, authLoading]);

  // Open pricing modal after login if buy parameter was present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const buyParam = params.get('buy');
    
    if (buyParam && user && !authLoading) {
      setShowPricingModal(true);
      setShowAuthModal(false);
      // Clean the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, authLoading]);

  // Handle successful Stripe payments (session_id in URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const authError = params.get('auth_error');
    
    if (sessionId && user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('💳 Payment success detected, refreshing profile...');
      }
      // Refresh the profile to get updated credits
      refreshProfile();
      // Show success notification
      setShowNotification(true);
      // Clean the URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Handle auth errors from OAuth callback
    if (authError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔐 Authentication error:', authError)
      }
      setError(`Authentication failed: ${authError}`);
      // Clean the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, refreshProfile]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (prompt.trim().length < 3) {
      setError('Description is too short. Please be more descriptive.');
      return;
    }

    // Check if user is logged in and has credits
    if (!isLoggedIn) {
      setError("Please sign in to generate images.");
      setShowAuthModal(true);
      return;
    }

    if (!hasCredits) {
      setError("You have run out of credits. Please purchase more to continue.");
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
        throw new Error(data.error || data.details || "Failed to generate image");
      }

      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        
        // Refresh profile to update credits display
        await refreshProfile();
      } else {
        throw new Error('Invalid response from server');
      }
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

  const handleRegenerate = () => {
    if (prompt) {
      handleGenerate();
    }
  };

  return (
    <div className="app fade-in">
      {/* Animated Background */}
      <div className="app-container">
        {/* Floating Particles */}
        <div className="particles">
          {Array.from({ length: 9 }).map((_, i) => (
            <div 
              key={`bg-particle-${i}`}
              className="particle" 
              style={{ 
                left: `${(i + 1) * 10}%`, 
                animationDelay: `${i * 0.5}s` 
              }}
            ></div>
          ))}
        </div>
      </div>

      <Header />
      
      <NavigationTabs />
      
      <FreeCreditsBanner />
      
      <CreditsDisplay />
      
      <CompactSuggestions 
        onStyleSelect={handleStyleSelect}
        onIdeaSelect={setPrompt}
      />
      
      <main className="main-content">
        <PromptSection
          prompt={prompt}
          onPromptChange={setPrompt}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        
        <ImageDisplay 
          imageUrl={imageUrl}
          isLoading={isLoading}
          error={error}
          onRegenerate={handleRegenerate}
          prompt={prompt}
        />

        <footer className="footer">
          <p className="footer-tagline">
            Deep Vortex AI - Building the complete AI creative ecosystem
          </p>
          <p className="footer-text">
            Powered by <span className="gradient-text">Deep Vortex</span> ×{' '}
            <span className="gradient-text">Replicate Imagen</span>
          </p>
        </footer>
      </main>

      {/* Notifications and Modals */}
      <Notification show={showNotification} onClose={() => setShowNotification(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: var(--bg-primary);
          position: relative;
          overflow-x: hidden;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .app-container {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
          pointer-events: none;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: auto;
          padding: 0.8rem 1.25rem 2.5rem;
          text-align: center;
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .footer {
          margin-top: 80px;
          text-align: center;
        }

        .footer-tagline {
          font-family: 'Orbitron', sans-serif;
          color: var(--gold-primary);
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          letter-spacing: 0.02em;
        }

        .footer-text {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--gold-dark), var(--gold-primary), var(--gold-light));
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 0.5rem 1.25rem 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}

