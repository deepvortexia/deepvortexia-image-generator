"use client";

export default function FreeCreditsBanner() {
  return (
    <div className="free-credits-banner" role="region" aria-label="Free credits promotion">
      <div className="banner-content">
        <span className="banner-icon" aria-hidden="true">🎁</span>
        <span className="banner-text">Get 2 free credits upon sign up!</span>
      </div>
      
      <style jsx>{`
        .free-credits-banner {
          display: flex;
          justify-content: center;
          padding: 0 1rem 1.5rem;
          position: relative;
          z-index: 40;
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(232, 200, 124, 0.1));
          border: 2px solid #D4AF37;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
          }
          50% {
            box-shadow: 0 4px 25px rgba(212, 175, 55, 0.5);
          }
        }

        .banner-icon {
          font-size: 1.8rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .banner-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #E8C87C;
          letter-spacing: 0.05em;
          text-align: center;
        }

        @media (max-width: 768px) {
          .free-credits-banner {
            padding: 0 1rem 1.2rem;
          }

          .banner-content {
            padding: 0.8rem 1.5rem;
            gap: 0.6rem;
          }

          .banner-icon {
            font-size: 1.5rem;
          }

          .banner-text {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .banner-content {
            padding: 0.8rem 1.2rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .banner-icon {
            font-size: 1.8rem;
          }

          .banner-text {
            font-size: 0.9rem;
            line-height: 1.3;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .banner-content {
            animation: none;
          }

          .banner-icon {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
