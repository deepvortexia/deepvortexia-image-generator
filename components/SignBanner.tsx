"use client";

export default function SignBanner() {
  return (
    <div className="sign-banner">
      <span className="sign-text">✨ Sign up and get 2 credits free ✨</span>
      
      <style jsx>{`
        .sign-banner {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          backdrop-filter: blur(5px);
          animation: pulse 3s infinite ease-in-out;
        }

        .sign-text {
          font-family: 'Orbitron', sans-serif;
          color: #D4AF37;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 rgba(212, 175, 55, 0); }
          50% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.1); }
          100% { box-shadow: 0 0 0 rgba(212, 175, 55, 0); }
        }

        @media (max-width: 768px) {
          .sign-text { font-size: 0.9rem; }
        }
      `}</style>
    </div>
  );
}
