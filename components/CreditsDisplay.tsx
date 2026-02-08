'use client';

import { useFreeGenerations } from '@/hooks/useFreeGenerations';

export default function CreditsDisplay() {
  const { freeGenerationsLeft, isLoggedIn, isClient } = useFreeGenerations();

  return (
    <div className="credits-display-section">
      <div className="credits-display-content">
        <div className="credits-info">
          {isLoggedIn ? (
            <>
              <span className="credits-icon">💰</span>
              <span className="credits-amount">439 credits</span>
            </>
          ) : (
            <>
              <span className="credits-icon">🎁</span>
              <span className="credits-amount">
                {isClient ? (
                  freeGenerationsLeft > 0 
                    ? `${freeGenerationsLeft} free generation${freeGenerationsLeft !== 1 ? 's' : ''} remaining`
                    : 'Sign in for unlimited generations!'
                ) : '2 free generations remaining'}
              </span>
            </>
          )}
        </div>
        
        <div className="credits-actions">
          <button 
            className="buy-credits-btn"
            onClick={() => {
              if (isLoggedIn) {
                console.log('Buy Credits - Coming Soon!');
              } else {
                window.location.href = 'https://deepvortexai.art/login';
              }
            }}
            aria-label={isLoggedIn ? "Buy more credits" : "Sign in"}
            title={isLoggedIn ? "Coming Soon" : "Sign in to get unlimited generations"}
          >
            <span aria-hidden="true">{isLoggedIn ? '💳' : '🔐'}</span>
            <span>{isLoggedIn ? 'Buy Credits' : 'Sign In'}</span>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .credits-display-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.5rem 1rem;
          margin: 0 auto;
          max-width: 900px;
        }

        .credits-display-content {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1rem 2rem;
          background: rgba(26, 26, 26, 0.8);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .credits-display-content:hover {
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
        }

        .credits-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .credits-icon {
          font-size: 1.5rem;
        }

        .credits-amount {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #D4AF37;
          letter-spacing: 0.05em;
        }

        .credits-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .buy-credits-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #D4AF37, #E8C87C);
          border: none;
          border-radius: 10px;
          color: #0a0a0a;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
        }

        .buy-credits-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #E8C87C, #F4D88A);
        }

        .buy-credits-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .credits-display-section {
            padding: 1rem 0.5rem;
          }
          
          .credits-display-content {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 1.5rem;
            width: 100%;
            max-width: 320px;
          }
          
          .credits-info {
            gap: 0.4rem;
          }
          
          .credits-icon {
            font-size: 1.3rem;
          }
          
          .credits-amount {
            font-size: 1rem;
          }
          
          .credits-actions {
            flex-direction: column;
            gap: 0.8rem;
            width: 100%;
          }
          
          .buy-credits-btn {
            width: 100%;
            justify-content: center;
            padding: 0.7rem 1rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .credits-display-content {
            gap: 1.5rem;
            padding: 0.9rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
