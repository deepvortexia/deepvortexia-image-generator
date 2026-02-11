import Link from "next/link";

export default function EcosystemCards() {
  return (
    <section className="tools-preview-section" role="region" aria-label="Available and upcoming AI tools">
      <h3 className="tools-preview-title">Complete AI Ecosystem</h3>
      <div className="tools-preview-grid" role="list">
        <div className="tool-card tool-card-active" role="listitem">
          <span className="tool-icon" aria-hidden="true">🖼️</span>
          <span className="tool-name">Image Gen</span>
          <span className="tool-status" aria-label="Currently available">Available Now</span>
        </div>
        
        <Link href="https://emoticons.deepvortexai.art" className="tool-card tool-card-active no-underline" role="listitem">
          <span className="tool-icon" aria-hidden="true">😊</span>
          <span className="tool-name">Emoticons</span>
          <span className="tool-status tool-status-green" aria-label="Available now">Available Now</span>
        </Link>
        
        <div className="tool-card tool-card-soon" role="listitem">
          <span className="tool-icon" aria-hidden="true">💬</span>
          <span className="tool-name">AI Chat</span>
          <span className="tool-status" aria-label="Coming in the future">Coming Soon</span>
        </div>
        
        <div className="tool-card tool-card-soon" role="listitem">
          <span className="tool-icon" aria-hidden="true">✨</span>
          <span className="tool-name">More Tools</span>
          <span className="tool-status" aria-label="Currently in development">In Development</span>
        </div>
      </div>
      
      <style jsx>{`
        .tools-preview-section {
          padding: 1.5rem 1rem 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .tools-preview-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #D4AF37;
          text-align: center;
          margin-bottom: 1rem;
          letter-spacing: 0.05em;
        }

        .tools-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .tool-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 1.2rem 0.8rem;
          background: rgba(26, 26, 26, 0.6);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          cursor: default;
        }

        .tool-card-active {
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.05);
        }
        
        .tool-card-available {
          border-color: rgba(212, 175, 55, 0.4);
          background: rgba(212, 175, 55, 0.03);
          cursor: pointer;
        }

        .tool-card-soon {
          opacity: 0.7;
        }

        .tool-card:hover {
          transform: translateY(-4px);
          border-color: #E8C87C;
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
        }

        .tool-card-active:hover {
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
        }
        
        .tool-card-available:hover {
          border-color: #D4AF37;
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
        }

        .tool-icon {
          font-size: 1.8rem;
        }

        .tool-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #E8C87C;
        }

        .tool-status {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: rgba(212, 175, 55, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tool-card-active .tool-status {
          color: #D4AF37;
          font-weight: 600;
        }
        
        .tool-card-active .tool-status-green {
          color: #10b981;
          font-weight: 600;
        }
        
        .tool-status-available {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: rgba(212, 175, 55, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        
        .no-underline {
          text-decoration: none;
        }

        @media (max-width: 480px) {
          .tools-preview-section {
            padding: 1rem 1rem 0.8rem;
          }
          
          .tools-preview-title {
            font-size: 1.2rem;
            margin-bottom: 0.8rem;
          }
          
          .tools-preview-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.8rem;
          }
          
          .tool-card {
            padding: 1rem 0.6rem;
            gap: 0.3rem;
          }
          
          .tool-icon {
            font-size: 1.4rem;
          }
          
          .tool-name {
            font-size: 0.9rem;
          }
          
          .tool-status, .tool-status-available {
            font-size: 0.7rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .tools-preview-section {
            padding: 1.2rem 1rem 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}
