"use client";

interface CreditsDisplayProps {
  credits: number;
  onBuyCredits?: () => void;
}

export default function CreditsDisplay({ credits, onBuyCredits }: CreditsDisplayProps) {
  return (
    <div className="credits-display-section">
      <div className="credits-display-content">
        <div className="credits-info">
          <span className="credits-icon">💎</span>
          <span className="credits-amount">{credits} credits</span>
        </div>
        
        <div className="credits-actions">
          <button 
            className="buy-credits-btn"
            onClick={onBuyCredits}
            aria-label="Buy more credits"
          >
            <span aria-hidden="true">💳</span>
            <span>Buy Credits</span>
          </button>
        </div>
      </div>
    </div>
  );
}
