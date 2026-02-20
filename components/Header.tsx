"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { PricingModal } from "@/components/PricingModal";

interface HeaderProps {
  buyPack?: string | null;
  onBuyPackHandled?: () => void;
}

export default function Header({ buyPack, onBuyPackHandled }: HeaderProps) {
  const { user, profile, signOut, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [defaultPack, setDefaultPack] = useState<string | null>(null);

  // Handle auto-open pricing modal when buyPack is provided
  useEffect(() => {
    if (buyPack) {
      setDefaultPack(buyPack);
      if (user) {
        setShowPricingModal(true);
      } else {
        setShowAuthModal(true);
      }
      if (onBuyPackHandled) {
        onBuyPackHandled();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyPack, user])

  // Add safety timeout for loading state
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        setShowRetry(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
      setShowRetry(false);
    }
  }, [loading])

  // FIX: No more confirm() dialog - just sign out directly
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleRetry = () => {
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

  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || profile?.avatar_url || null;
  };

  const getUserDisplayName = () => {
    return profile?.full_name || profile?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName.length >= 2) {
      return displayName.substring(0, 2).toUpperCase();
    }
    return displayName.toUpperCase() || 'U';
  };

  return (
    <>
      <header className="hub-header" role="banner">
        {/* Back to Hub Link */}
        <Link href="https://deepvortexai.art" className="back-to-hub-link">
          ← Back to Hub
        </Link>

        {/* Logo Display Zone with Rotating Orbits */}
        <div className="logo-display-zone">
          <div className="orbit-ring-one" />
          <div className="orbit-ring-two" />
          <div className="orbit-ring-three" />
          <Image 
            src="/deepgoldremoveetiny.png" 
            alt="Deep Vortex" 
            width={120} 
            height={120}
            className="brand-logo-image"
            priority
          />
        </div>

        {/* Brand Title */}
        <h1 className="brand-title-text">DΞΞP VORTΞX AI</h1>
        
        {/* Tagline */}
        <p className="primary-tagline">Your AI Tools Ecosystem</p>

        {/* Pill Buttons Container */}
        <div className="hub-pills-container">
          {/* Credits Pill */}
          <div className="hub-pill credits-pill">
            <span className="pill-icon">🏆</span>
            <span className="pill-text">
              {user ? `${profile?.credits ?? 0} credits` : 'Sign in for credits'}
            </span>
          </div>

          {/* Buy Credits Pill */}
          <button 
            className="hub-pill buy-credits-pill"
            onClick={handleBuyCreditsClick}
            title="Purchase more credits"
          >
            <span className="pill-icon">💳</span>
            <span className="pill-text">Buy Credits</span>
          </button>

          {/* Favorites Pill */}
          <button 
            className="hub-pill favorites-pill"
            onClick={handleFavoritesClick}
            title="View your favorite images"
          >
            <span className="pill-icon">⭐</span>
            <span className="pill-text">Favorites</span>
          </button>

          {/* Profile / Sign In Pill */}
          {user ? (
            <div className="hub-pill profile-pill">
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
              className="hub-pill signin-pill"
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

          {/* Retry Button */}
          {showRetry && (
            <button 
              className="hub-pill retry-pill"
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
      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => {
          setShowPricingModal(false);
          setDefaultPack(null);
        }}
        defaultPack={defaultPack}
      />

      <style jsx>{`
        .hub-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem 1rem;
          background: transparent;
          position: relative;
          z-index: 100;
        }

        .back-to-hub-link {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.5);
          color: #D4AF37;
          border-radius: 8px;
          padding: 0.4rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .back-to-hub-link:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: #D4AF37;
          transform: translateX(-2px);
        }

        .logo-display-zone {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto 1rem;
        }

        .brand-logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: relative;
          z-index: 3;
          animation: logoGlowPulse 3s ease-in-out infinite;
          filter: drop-shadow(0 0 20px var(--gold-primary));
        }

        @keyframes logoGlowPulse {
          0%, 100% { filter: drop-shadow(0 0 20px var(--gold-primary)) brightness(1); }
          50% { filter: drop-shadow(0 0 35px var(--gold-light)) brightness(1.2); }
        }

        .orbit-ring-one, .orbit-ring-two, .orbit-ring-three {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid var(--gold-primary);
          border-radius: 50%;
          opacity: 0.3;
        }

        .orbit-ring-one {
          width: 180px;
          height: 180px;
          animation: orbitSpin 12s linear infinite;
          border-top-color: transparent;
          border-left-color: transparent;
        }

        .orbit-ring-two {
          width: 210px;
          height: 210px;
          animation: orbitSpin 18s linear infinite reverse;
          border-right-color: transparent;
          border-bottom-color: transparent;
        }

        .orbit-ring-three {
          width: 240px;
          height: 240px;
          animation: orbitSpin 24s linear infinite;
          border-top-color: transparent;
          border-bottom-color: transparent;
        }

        @keyframes orbitSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .brand-title-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          margin: 1rem 0;
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 50%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 3px;
          text-align: center;
        }

        .primary-tagline {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.3rem;
          color: var(--gold-light);
          margin: 0.5rem 0 2rem;
          font-weight: 500;
          text-align: center;
        }

        .hub-pills-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hub-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s ease;
          white-space: nowrap;
          cursor: default;
        }

        .pill-icon { font-size: 1.1rem; line-height: 1; }
        .pill-text { line-height: 1; }

        .credits-pill { border: 2px solid var(--gold-accent); color: var(--gold-accent); }

        .buy-credits-pill {
          border: 2px solid var(--gold-accent);
          color: var(--gold-accent);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
        }
        .buy-credits-pill:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
        }

        .favorites-pill { border: 1px solid rgba(212, 175, 55, 0.3); color: #D4AF37; cursor: pointer; }
        .favorites-pill:hover {
          border-color: rgba(212, 175, 55, 0.6);
          background: rgba(212, 175, 55, 0.05);
          transform: translateY(-2px);
        }

        .profile-pill { padding: 0.5rem 1rem; gap: 0.75rem; border: 1px solid rgba(212, 175, 55, 0.3); color: #D4AF37; }

        .profile-avatar {
          width: 32px; height: 32px;
          border-radius: 50%; overflow: hidden;
          border: 2px solid var(--gold-accent); flex-shrink: 0;
        }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .profile-avatar-fallback {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #E8C87C);
          color: #0a0a0a;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem;
          border: 2px solid var(--gold-accent); flex-shrink: 0;
        }

        .profile-name { color: #E8C87C; font-size: 0.9rem; }

        .signout-btn {
          padding: 0.3rem 0.8rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          color: #D4AF37; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .signout-btn:hover { background: rgba(212, 175, 55, 0.2); border-color: #D4AF37; }

        .signin-pill { border: 1px solid rgba(212, 175, 55, 0.3); color: #D4AF37; cursor: pointer; }
        .signin-pill:hover:not(:disabled) {
          border-color: var(--gold-accent);
          background: rgba(255, 215, 0, 0.05);
          transform: translateY(-2px);
        }
        .signin-pill:disabled { opacity: 0.6; cursor: not-allowed; }

        .retry-pill { border: 1px solid rgba(212, 175, 55, 0.3); color: #D4AF37; cursor: pointer; }
        .retry-pill:hover { border-color: var(--gold-accent); background: rgba(255, 215, 0, 0.05); }

        @media (max-width: 768px) {
          .hub-header { padding: 1.5rem 1rem 1rem; }
          .logo-display-zone { width: 120px; height: 120px; }
          .orbit-ring-one { width: 140px; height: 140px; }
          .orbit-ring-two { width: 160px; height: 160px; }
          .orbit-ring-three { width: 180px; height: 180px; }
          .brand-title-text { font-size: 1.5rem; letter-spacing: 2px; }
          .primary-tagline { font-size: 1rem; }
          .hub-pills-container { gap: 0.75rem; }
          .hub-pill { padding: 0.5rem 1rem; font-size: 0.9rem; }
          .pill-icon { font-size: 1rem; }
          .profile-name { display: none; }
          .profile-pill { padding: 0.5rem 0.75rem; }
        }

        @media (max-width: 480px) {
          .hub-header { padding: 1rem 0.5rem 1rem; }
          .logo-display-zone { width: 100px; height: 100px; }
          .orbit-ring-one { width: 120px; height: 120px; }
          .orbit-ring-two { width: 140px; height: 140px; }
          .orbit-ring-three { width: 160px; height: 160px; }
          .brand-title-text { font-size: 1.2rem; letter-spacing: 1px; }
          .primary-tagline { display: none; }
          .hub-pills-container { flex-direction: column; width: 100%; max-width: 300px; gap: 0.75rem; }
          .hub-pill { width: 100%; justify-content: center; padding: 0.7rem 1rem; }
          .profile-name { display: inline; }
          .profile-pill { padding: 0.6rem 1rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-logo-image, .orbit-ring-one, .orbit-ring-two, .orbit-ring-three { animation: none; }
          .back-to-hub-link:hover, .buy-credits-pill:hover, .favorites-pill:hover, .signin-pill:hover { transform: none; }
        }
      `}</style>
    </>
  );
}
