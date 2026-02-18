"use client";

import { useState, useEffect } from "react";
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
    // Instead of reloading the entire page, try to refresh the profile
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

  return (
    <>
      {/* Hub Style Pill Buttons Header */}
      <header className="hub-header" role="banner">
        <div className="hub-pills-container">
          {/* Element A - Credits Pill */}
          <div className="hub-pill credits-pill">
            <span className="pill-icon">🏆</span>
            <span className="pill-text">
              {user ? (
                `${profile?.credits ?? 0} credits`
              ) : (
                'Sign in for credits'
              )}
            </span>
          </div>

          {/* Element B - Buy Credits Pill (Primary Action) */}
          <button 
            className="hub-pill buy-credits-pill"
            onClick={handleBuyCreditsClick}
            title="Purchase more credits"
          >
            <span className="pill-icon">💳</span>
            <span className="pill-text">Buy Credits</span>
          </button>

          {/* Element C - Favorites Pill */}
          <button 
            className="hub-pill favorites-pill"
            onClick={handleFavoritesClick}
            title="View your favorite images"
          >
            <span className="pill-icon">⭐</span>
            <span className="pill-text">Favorites</span>
          </button>

          {/* Element D - Profile Pill */}
          {user ? (
            <div className="hub-pill profile-pill">
              {getAvatarUrl() ? (
                <div className="profile-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getAvatarUrl()!} alt="User avatar" />
                </div>
              ) : (
                <div className="profile-avatar-fallback">
                  {getUserDisplayName().substring(0, 2).toUpperCase()}
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

          {/* Retry Button (only shown on timeout) */}
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
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

      <style jsx>{`
        /* Hub Style Header */
        .hub-header {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          background: transparent;
          position: relative;
          z-index: 100;
        }

        .hub-pills-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Base Pill Style */
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

        .hub-pill button {
          all: unset;
        }

        .pill-icon {
          font-size: 1.1rem;
          line-height: 1;
        }

        .pill-text {
          line-height: 1;
        }

        /* Element A - Credits Pill */
        .credits-pill {
          border: 2px solid #FFD700;
          color: #FFD700;
        }

        /* Element B - Buy Credits Pill (Primary Action) */
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

        /* Element C - Favorites Pill */
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

        /* Element D - Profile Pill (larger, contains multiple elements) */
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
          .hub-pills-container {
            gap: 0.75rem;
          }

          .hub-pill {
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
          .hub-pills-container {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
            gap: 0.75rem;
          }

          .hub-pill {
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

