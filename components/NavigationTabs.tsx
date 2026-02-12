"use client";

import Link from "next/link";

export default function NavigationTabs() {
  return (
    <nav className="navigation-tabs" role="navigation" aria-label="Main navigation">
      <div className="tabs-container">
        <Link 
          href="https://emoticons.deepvortexai.art"
          className="tab-item"
          aria-label="Emoticon generator"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="tab-icon" aria-hidden="true">😊</span>
          <span className="tab-label">Emoticon</span>
        </Link>
        
        <div className="tab-item tab-active" aria-current="page">
          <span className="tab-icon" aria-hidden="true">🖼️</span>
          <span className="tab-label">Image</span>
        </div>
        
        <div className="tab-item tab-disabled" aria-disabled="true">
          <span className="tab-icon" aria-hidden="true">🎬</span>
          <span className="tab-label">Video</span>
          <span className="tab-badge">Coming Soon</span>
        </div>
        
        <div className="tab-item tab-disabled" aria-disabled="true">
          <span className="tab-icon" aria-hidden="true">🗑️</span>
          <span className="tab-label">Remove Background</span>
          <span className="tab-badge">Coming Soon</span>
        </div>
      </div>
      
      <style jsx>{`
        .navigation-tabs {
          display: flex;
          justify-content: center;
          padding: 1rem 1rem 1.5rem;
          position: relative;
          z-index: 50;
        }

        .tabs-container {
          display: flex;
          gap: 0.5rem;
          background: rgba(26, 26, 26, 0.8);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 0.5rem;
          backdrop-filter: blur(10px);
          max-width: 900px;
          width: 100%;
        }

        .tab-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 1rem 1.5rem;
          flex: 1;
          min-width: 0;
          background: rgba(20, 20, 20, 0.5);
          border: 2px solid transparent;
          border-radius: 12px;
          color: rgba(212, 175, 55, 0.6);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-item:not(.tab-disabled):not(.tab-active):hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.5);
          color: #D4AF37;
          transform: translateY(-2px);
        }

        .tab-active {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(232, 200, 124, 0.15));
          border: 2px solid #D4AF37;
          color: #E8C87C;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          cursor: default;
        }

        .tab-active .tab-icon {
          font-size: 1.8rem;
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
        }

        .tab-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .tab-icon {
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .tab-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-align: center;
          line-height: 1.2;
        }

        .tab-badge {
          position: absolute;
          top: 0.3rem;
          right: 0.3rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          background: rgba(212, 175, 55, 0.2);
          color: #D4AF37;
          border: 1px solid rgba(212, 175, 55, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .navigation-tabs {
            padding: 0.8rem 1rem 1.2rem;
          }

          .tabs-container {
            gap: 0.4rem;
            padding: 0.4rem;
          }

          .tab-item {
            padding: 0.8rem 0.5rem;
            gap: 0.25rem;
          }

          .tab-icon {
            font-size: 1.3rem;
          }

          .tab-active .tab-icon {
            font-size: 1.5rem;
          }

          .tab-label {
            font-size: 0.75rem;
          }

          .tab-badge {
            font-size: 0.55rem;
            padding: 0.2rem 0.4rem;
            top: 0.2rem;
            right: 0.2rem;
          }
        }

        @media (max-width: 480px) {
          .tabs-container {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .tab-item {
            flex: 1 1 calc(50% - 0.25rem);
            min-width: calc(50% - 0.25rem);
            padding: 1rem 0.8rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .tab-item {
            padding: 1rem 1.2rem;
          }

          .tab-label {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </nav>
  );
}
