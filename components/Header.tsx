"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { FavoritesModal } from "@/components/FavoritesModal";

export default function Header() {
  const { user, profile, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  
  // Debug logging for Header
  useEffect(() => {
    console.log('🎯 Header: Auth state changed', { 
      hasUser: !!user,
      email: user?.email || 'null',
      hasProfile: !!profile,
      credits: profile?.credits || 0,
      loading 
    })
  }, [user, profile, loading])

  // Add safety timeout for loading state
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.log('⏰ Header: Loading timeout reached after 5 seconds');
        setLoadingTimeout(true);
        setShowRetry(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
      setShowRetry(false);
    }
  }, [loading])
  
  const handleAuthAction = () => {
    if (user) {
      // User is logged in, show sign out confirmation
      console.log('🚪 Signing out user:', user.email)
      if (confirm('Are you sure you want to sign out?')) {
        signOut();
      }
    } else {
      // User is not logged in, show auth modal
      console.log('🔐 Opening auth modal')
      setShowAuthModal(true);
    }
  };

  const handleRetry = () => {
    console.log('🔄 Retrying authentication check...');
    setShowRetry(false);
    setLoadingTimeout(false);
    window.location.reload();
  };

  const handleFavoritesClick = () => {
    setShowFavoritesModal(true);
  };

  // Get user avatar URL from Google OAuth or profile
  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || profile?.avatar_url || null;
  };

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    const name = profile?.full_name || profile?.email || user?.email || '';
    const parts = name.split(/[\s@]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="app-header">
        {/* Back to Home Button */}
        <Link 
          href="https://deepvortexai.art"
          className="back-to-home-link"
        >
          <span className="back-to-home-text-full">← Back to Home</span>
          <span className="back-to-home-text-short">← Home</span>
        </Link>
        
        <div className="logo-container-magic">
          {/* Magic effects wrapper around logo */}
          <div className="magic-effects-wrapper">
            {/* Pulsing glow aura */}
            <div className="magic-glow"></div>
            
            {/* Rotating magic circles */}
            <div className="magic-circles">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
            </div>
            
            {/* Floating particles */}
            <div className="magic-particles">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`particle-${i}`} className="magic-particle"></div>
              ))}
            </div>
            
            {/* Logo in center */}
            <Image 
              src="/deepgoldremoveetiny.png" 
              alt="Deep Vortex Logo" 
              width={200}
              height={200}
              className="app-logo-large"
              aria-label="Deep Vortex AI - Image Generator"
              priority
            />
          </div>
          
          {/* Brand text below logo */}
          <h1 className="brand-text-orbitron">DΞΞP VORTΞX AI</h1>
          
          {/* Short description */}
          <p className="brand-description">Your AI Tools Ecosystem</p>
        </div>
      </header>
      
      {/* Action Buttons Section */}
      <div className="action-buttons-section">
        <button 
          className="action-btn action-btn-signin"
          onClick={handleAuthAction}
          disabled={loading && !loadingTimeout}
          title={user ? `Signed in as ${user.email} - Click to sign out` : "Sign in to get unlimited generations"}
        >
          {user && getAvatarUrl() ? (
            <div className="user-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getAvatarUrl()!} alt="User avatar" />
            </div>
          ) : user ? (
            <div className="user-initials">{getUserInitials()}</div>
          ) : (
            <span className="btn-icon" aria-hidden="true">🔐</span>
          )}
          <span>
            {(loading && !loadingTimeout) ? 'Loading...' : user ? (
              profile?.email?.split('@')[0] || profile?.full_name || 'Profile'
            ) : 'Sign In'}
          </span>
        </button>
        {showRetry && (
          <button 
            className="action-btn action-btn-retry"
            onClick={handleRetry}
            title="Retry loading"
          >
            <span className="btn-icon" aria-hidden="true">🔄</span>
            <span>Retry</span>
          </button>
        )}
        <Link 
          href="https://emoticons.deepvortexai.art"
          className="action-btn action-btn-emoticons"
          title="Create AI Emoticons"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="btn-icon" aria-hidden="true">🎭</span>
          <span>Emoticons</span>
        </Link>
        <button 
          className="action-btn action-btn-favorites"
          onClick={handleFavoritesClick}
          title="View your favorite images"
        >
          <span className="btn-icon" aria-hidden="true">⭐</span>
          <span>Favorites</span>
        </button>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <FavoritesModal isOpen={showFavoritesModal} onClose={() => setShowFavoritesModal(false)} />

      <style jsx>{`
        .app-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 1rem 2rem;
          background: var(--bg-primary);
          position: relative;
          z-index: 100;
        }

        .back-to-home-link {
          position: absolute;
          top: 1rem;
          left: 1rem;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
          z-index: 101;
        }

        .back-to-home-link:hover {
          color: var(--gold-primary);
        }

        .back-to-home-text-short {
          display: none;
        }

        .back-to-home-text-full {
          display: inline;
        }

        .logo-container-magic {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
        }

        .magic-effects-wrapper {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .app-logo-large {
          width: 200px;
          height: auto;
          display: block;
          position: relative;
          z-index: 10;
          filter: drop-shadow(0 0 15px var(--glow-gold));
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .app-logo-large:hover {
          transform: scale(1.05) translateZ(0);
          filter: drop-shadow(0 0 25px var(--glow-gold-strong));
        }

        .magic-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent 70%);
          border-radius: 50%;
          animation: pulse-glow 3s ease-in-out infinite;
          pointer-events: none;
          will-change: transform, opacity;
        }

        @keyframes pulse-glow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.7;
          }
        }

        .magic-circles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          height: 280px;
          pointer-events: none;
        }

        .circle {
          position: absolute;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 50%;
          animation: rotate-circle 20s linear infinite;
          will-change: transform;
        }

        .circle-1 {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          animation-duration: 20s;
          border-style: dashed;
        }

        .circle-2 {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          animation-duration: 15s;
          animation-direction: reverse;
        }

        .circle-3 {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          animation-duration: 25s;
          border-style: dotted;
        }

        @keyframes rotate-circle {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .magic-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .magic-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #E8C87C, #D4AF37);
          border-radius: 50%;
          opacity: 0.7;
          animation: float-particle 4s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .magic-particle:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
        .magic-particle:nth-child(2) { top: 30%; left: 80%; animation-delay: 0.5s; }
        .magic-particle:nth-child(3) { top: 40%; left: 10%; animation-delay: 1s; }
        .magic-particle:nth-child(4) { top: 50%; left: 85%; animation-delay: 1.5s; }
        .magic-particle:nth-child(5) { top: 60%; left: 20%; animation-delay: 2s; }
        .magic-particle:nth-child(6) { top: 70%; left: 75%; animation-delay: 2.5s; }
        .magic-particle:nth-child(7) { top: 15%; left: 50%; animation-delay: 3s; }
        .magic-particle:nth-child(8) { top: 25%; left: 40%; animation-delay: 0.8s; }
        .magic-particle:nth-child(9) { top: 55%; left: 60%; animation-delay: 1.3s; }
        .magic-particle:nth-child(10) { top: 75%; left: 35%; animation-delay: 1.8s; }
        .magic-particle:nth-child(11) { top: 35%; left: 65%; animation-delay: 2.3s; }
        .magic-particle:nth-child(12) { top: 65%; left: 55%; animation-delay: 2.8s; }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translate(10px, -15px) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translate(-8px, -25px) scale(0.9);
            opacity: 0.5;
          }
          75% {
            transform: translate(15px, -10px) scale(1.1);
            opacity: 0.8;
          }
        }

        .brand-text-orbitron {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--gold-primary);
          letter-spacing: 0.15em;
          text-align: center;
          margin: 1.5rem 0 0.5rem;
          text-transform: uppercase;
          line-height: 1.2;
          text-shadow: 0 0 20px var(--glow-gold);
        }

        .brand-description {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          color: var(--gold-primary);
          text-align: center;
          margin: 0;
          padding: 0;
          font-weight: 600;
        }

        .action-buttons-section {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          align-items: center;
          padding: 1.5rem 1rem 1rem;
          position: relative;
          z-index: 100;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 2rem;
          background: rgba(26, 26, 26, 0.8);
          border: 2px solid var(--gold-primary);
          border-radius: 12px;
          color: var(--gold-primary);
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          will-change: transform;
          text-decoration: none;
        }

        .action-btn:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: var(--gold-light);
          transform: translateY(-2px) translateZ(0);
          box-shadow: 0 4px 15px var(--glow-gold-strong);
        }

        .action-btn .btn-icon {
          font-size: 1.2rem;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--gold-primary);
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-initials {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #E8C87C);
          color: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          border: 2px solid var(--gold-primary);
        }

        @media (max-width: 480px) {
          .app-header {
            padding: 0.8rem 1rem 1.5rem;
          }
          
          .back-to-home-text-full {
            display: none;
          }
          
          .back-to-home-text-short {
            display: inline;
          }
          
          .back-to-home-link {
            font-size: 0.85rem;
          }
          
          .logo-container-magic {
            padding: 0;
          }
          
          .magic-effects-wrapper {
            width: 200px;
            height: 200px;
          }
          
          .app-logo-large {
            width: 140px;
          }
          
          .brand-text-orbitron {
            font-size: 1.4rem;
            letter-spacing: 0.1em;
          }
          
          .brand-description {
            font-size: 0.9rem;
          }
          
          .magic-particle:nth-child(n+7) {
            visibility: hidden;
          }
          
          .action-buttons-section {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 1rem 0.8rem;
          }
          
          .action-btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .magic-effects-wrapper {
            width: 240px;
            height: 240px;
          }
          
          .app-logo-large {
            width: 160px;
          }
          
          .brand-text-orbitron {
            font-size: 1.7rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .app-logo-large {
            animation: none;
          }
          
          .magic-particle {
            display: none;
          }
          
          .magic-glow,
          .magic-circles {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

