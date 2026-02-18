"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { PricingModal } from "@/components/PricingModal";

export default function Header() {
  const { user, profile, signOut, loading, refreshProfile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  
  // Debug logging for Header
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Header: Auth state changed', { 
        hasUser: !!user,
        email: user?.email || 'null',
        hasProfile: !!profile,
        credits: profile?.credits || 0,
        loading 
      })
    }
  }, [user, profile, loading])

  // Add safety timeout for loading state
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('⏰ Header: Loading timeout reached after 5 seconds');
        }
        setLoadingTimeout(true);
        setShowRetry(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
      setShowRetry(false);
    }
  }, [loading])
  
  const handleSignOut = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚪 Signing out user:', user?.email)
    }
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
    }
  };

  const handleRetry = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Retrying authentication check...');
    }
    setShowRetry(false);
    setLoadingTimeout(false);
    if (user) {
      refreshProfile();
    }
  };

  const handleFavoritesClick = () => {
    setShowFavoritesModal(true);
  };

  const handleBuyCreditsClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowPricingModal(true);
    }
  };

  // Get user avatar URL from Google OAuth or profile
  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || profile?.avatar_url || null;
  };

  // Get user display name
  const getUserDisplayName = () => {
    return profile?.full_name || profile?.email?.split('@')[0] || 'User';
  };

  // Get user initials safely
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName.length >= 2) {
      return displayName.substring(0, 2).toUpperCase();
    }
    return displayName.toUpperCase() || 'U';
  };

  return (
    <>
      {/* Header with Branding + Pill Bar */}
      <header className="header-wrapper" role="banner">
        {/* "Back to Hub" Link - Top Left */}
        <a href="https://deepvortexai.art" className="back-to-hub-link">
          ← Back to Hub
        </a>

        {/* SECTION 1 - Branding */}
        <div className="branding-section">
          <div className="magic-effects-wrapper">
            {/* Rotating Orbit Circles */}
            <div className="orbit orbit-1"></div>
            <div className="orbit orbit-2"></div>
            <div className="orbit orbit-3"></div>

            {/* Pulsing Glow */}
            <div className="glow-effect"></div>

            {/* Floating Particles */}
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>

            {/* Logo */}
            <div className="logo-container">
              <Image
                src="/deepgoldremoveetiny.png"
                alt="Deep Vortex AI Logo"
                width={120}
                height={120}
                className="logo-image"
                priority
              />
            </div>
          </div>

          {/* Title and Subtitle */}
          <h1 className="brand-title">DΞΞP VORTΞX AI</h1>
          <p className="brand-subtitle">Your AI Tools Ecosystem</p>
        </div>

        {/* SECTION 2 - Pill Bar */}
        <div className="pill-bar">
          {/* Pill A - Credits */}
          <div className="pill credits-pill">
            <span className="pill-icon">🏆</span>
            <span className="pill-text">
              {user ? (
                `${profile?.credits ?? 0} credits`
              ) : (
                'Sign in for credits'
              )}
            </span>
          </div>

          {/* Pill B - Buy Credits (Primary Action) */}
          <button 
            className="pill buy-credits-pill"
            onClick={handleBuyCreditsClick}
            title="Purchase more credits"
          >
            <span className="pill-icon">💳</span>
            <span className="pill-text">Buy Credits</span>
          </button>

          {/* Pill C - Favorites */}
          <button 
            className="pill favorites-pill"
            onClick={handleFavoritesClick}
            title="View your favorite images"
          >
            <span className="pill-icon">⭐</span>
            <span className="pill-text">Favorites</span>
          </button>

          {/* Pill D - Profile / Sign In */}
          {user ? (
            <div className="pill profile-pill">
              {getAvatarUrl() ? (
                <div className="profile-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getAvatarUrl()!} alt={`${getUserDisplayName()}'s avatar`} />
                </div>
              ) : (
                <div className="profile-avatar-fallback">
                  {getUserInitials()}
                </div>
              )}
              <span className="profile-name">{getUserDisplayName()}</span>
              <button 
                className="signout-btn"
                onClick={handleSignOut}
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              className="pill signin-pill"
              onClick={() => setShowAuthModal(true)}
              disabled={loading && !loadingTimeout}
              title="Sign in to get credits"
            >
              <span className="pill-icon">🔐</span>
              <span className="pill-text">
                {(loading && !loadingTimeout) ? 'Loading...' : 'Sign In'}
              </span>
            </button>
          )}

          {/* Retry Button (only shown on timeout) */}
          {showRetry && (
            <button 
              className="pill retry-pill"
              onClick={handleRetry}
              title="Retry loading"
            >
              <span className="pill-icon">🔄</span>
              <span className="pill-text">Retry</span>
            </button>
          )}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <FavoritesModal isOpen={showFavoritesModal} onClose={() => setShowFavoritesModal(false)} />
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

      <style jsx>{`
        /* Header Wrapper */
        .header-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 1rem;
          background: transparent;
          position: relative;
          z-index: 100;
          gap: 2rem;
        }

        /* Back to Hub Link */
        .back-to-hub-link {
          position: absolute;
          top: 1rem;
          left: 1rem;
          color: #D4AF37;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
          z-index: 110;
        }

        .back-to-hub-link:hover {
          color: #FFD700;
          text-decoration: underline;
        }

        /* SECTION 1 - Branding */
        .branding-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .magic-effects-wrapper {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Logo */
        .logo-container {
          position: relative;
          z-index: 3;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.6));
        }

        /* Pulsing Glow */
        .glow-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.4), transparent 70%);
          border-radius: 50%;
          z-index: 1;
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
        }

        /* Rotating Orbit Circles */
        .orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          z-index: 2;
        }

        .orbit-1 {
          width: 140px;
          height: 140px;
          border: 2px dashed rgba(212, 175, 55, 0.4);
          transform: translate(-50%, -50%);
          animation: rotate 20s linear infinite;
        }

        .orbit-2 {
          width: 170px;
          height: 170px;
          border: 2px solid rgba(212, 175, 55, 0.3);
          transform: translate(-50%, -50%);
          animation: rotate 30s linear infinite reverse;
        }

        .orbit-3 {
          width: 200px;
          height: 200px;
          border: 2px dotted rgba(212, 175, 55, 0.2);
          transform: translate(-50%, -50%);
          animation: rotate 40s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        /* Floating Particles */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #FFD700;
          border-radius: 50%;
          z-index: 2;
          animation: float 6s ease-in-out infinite;
        }

        .particle-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }

        .particle-2 {
          top: 30%;
          right: 15%;
          animation-delay: 1s;
        }

        .particle-3 {
          bottom: 25%;
          left: 25%;
          animation-delay: 2s;
        }

        .particle-4 {
          bottom: 20%;
          right: 20%;
          animation-delay: 3s;
        }

        .particle-5 {
          top: 50%;
          left: 10%;
          animation-delay: 4s;
        }

        .particle-6 {
          top: 50%;
          right: 10%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-15px) scale(1.2);
            opacity: 1;
          }
        }

        /* Brand Title */
        .brand-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #FFD700;
          margin: 0;
          letter-spacing: 2px;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        }

        /* Brand Subtitle */
        .brand-subtitle {
          font-size: 0.95rem;
          color: #D4AF37;
          margin: 0;
          letter-spacing: 0.5px;
        }

        /* SECTION 2 - Pill Bar */
        .pill-bar {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Base Pill Style */
        .pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s ease;
          white-space: nowrap;
          cursor: default;
          border: 2px solid transparent;
        }

        .pill button {
          all: unset;
        }

        .pill-icon {
          font-size: 1.1rem;
          line-height: 1;
        }

        .pill-text {
          line-height: 1;
        }

        /* Pill A - Credits */
        .credits-pill {
          border: 2px solid #FFD700;
          color: #FFD700;
        }

        /* Pill B - Buy Credits (Primary Action) */
        .buy-credits-pill {
          border: 2px solid #FFD700;
          color: #FFD700;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
        }

        .buy-credits-pill:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
        }

        /* Pill C - Favorites */
        .favorites-pill {
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #D4AF37;
          cursor: pointer;
        }

        .favorites-pill:hover {
          border-color: rgba(212, 175, 55, 0.6);
          background: rgba(212, 175, 55, 0.05);
          transform: translateY(-2px);
        }

        /* Pill D - Profile (contains avatar + name + sign out) */
        .profile-pill {
          padding: 0.5rem 1rem;
          gap: 0.75rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #D4AF37;
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #FFD700;
          flex-shrink: 0;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-avatar-fallback {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #E8C87C);
          color: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          border: 2px solid #FFD700;
          flex-shrink: 0;
        }

        .profile-name {
          color: #E8C87C;
          font-size: 0.9rem;
        }

        .signout-btn {
          padding: 0.3rem 0.8rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          color: #D4AF37;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .signout-btn:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: #D4AF37;
        }

        /* Sign In Pill (when not logged in) */
        .signin-pill {
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #D4AF37;
          cursor: pointer;
        }

        .signin-pill:hover:not(:disabled) {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.05);
          transform: translateY(-2px);
        }

        .signin-pill:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Retry Pill */
        .retry-pill {
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #D4AF37;
          cursor: pointer;
        }

        .retry-pill:hover {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.05);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .magic-effects-wrapper {
            width: 120px;
            height: 120px;
          }

          .logo-container {
            width: 80px;
            height: 80px;
          }

          .glow-effect {
            width: 80px;
            height: 80px;
          }

          .orbit-1 {
            width: 90px;
            height: 90px;
          }

          .orbit-2 {
            width: 105px;
            height: 105px;
          }

          .orbit-3 {
            width: 120px;
            height: 120px;
          }

          .brand-title {
            font-size: 1.2rem;
          }

          .pill-bar {
            gap: 0.75rem;
          }

          .pill {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .pill-icon {
            font-size: 1rem;
          }

          .profile-name {
            display: none;
          }

          .profile-pill {
            padding: 0.5rem 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .magic-effects-wrapper {
            width: 100px;
            height: 100px;
          }

          .logo-container {
            width: 65px;
            height: 65px;
          }

          .glow-effect {
            width: 65px;
            height: 65px;
          }

          .orbit-1 {
            width: 75px;
            height: 75px;
          }

          .orbit-2 {
            width: 87px;
            height: 87px;
          }

          .orbit-3 {
            width: 100px;
            height: 100px;
          }

          .brand-title {
            font-size: 1rem;
          }

          .brand-subtitle {
            display: none;
          }

          .pill-bar {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
            gap: 0.75rem;
          }

          .pill {
            width: 100%;
            justify-content: center;
            padding: 0.7rem 1rem;
          }

          .profile-name {
            display: inline;
          }

          .profile-pill {
            padding: 0.6rem 1rem;
          }
        }
      `}</style>
    </>
  );
}
