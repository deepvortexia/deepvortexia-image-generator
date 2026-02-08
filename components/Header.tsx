"use client";

interface HeaderProps {
  credits: number;
  onSignIn?: () => void;
  onFavorites?: () => void;
}

export default function Header({ credits, onSignIn, onFavorites }: HeaderProps) {
  return (
    <>
      {/* App Header - Minimal & Magical */}
      <header className="app-header">
        {/* Back to Home Button */}
        <a 
          href={process.env.NEXT_PUBLIC_HUB_URL || "https://deepvortexai.art"}
          className="back-to-home-link"
        >
          <span className="back-to-home-text-full">← Back to Home</span>
          <span className="back-to-home-text-short">← Home</span>
        </a>
        
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
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
              <div className="magic-particle"></div>
            </div>
            
            {/* Logo in center - using a gold circle as placeholder */}
            <div 
              className="app-logo-large"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #E8C87C 0%, #D4AF37 50%, #B8860B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#0a0a0a'
              }}
            >
              DV
            </div>
          </div>
          
          {/* Brand text below logo */}
          <h1 className="brand-text-orbitron">DΞΞP VORTΞX AI</h1>
          
          {/* Short description */}
          <p className="brand-description">
            Your AI Tools Ecosystem
          </p>
        </div>
      </header>
      
      {/* Action Buttons Section */}
      <div className="action-buttons-section">
        <button 
          className="action-btn action-btn-signin"
          onClick={onSignIn}
        >
          <span className="btn-icon" aria-hidden="true">🔒</span>
          <span>Sign In</span>
        </button>
        <button 
          className="action-btn action-btn-favorites"
          onClick={onFavorites}
        >
          <span className="btn-icon" aria-hidden="true">⭐</span>
          <span>Favorites</span>
        </button>
      </div>
    </>
  );
}
