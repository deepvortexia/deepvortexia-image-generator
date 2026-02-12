import Link from "next/link";

export default function EcosystemCards() {
  return (
    <section className="tools-preview-section" role="region" aria-label="Available and upcoming AI tools">
      <h3 className="tools-preview-title">Complete AI Ecosystem</h3>
      <div className="tools-preview-grid" role="list">
        <Link href="https://images.deepvortexai.art/" className="tool-card tool-card-available no-underline" role="listitem">
          <span className="available-badge" aria-label="This tool is available">✅ Available</span>
          <span className="tool-icon" aria-hidden="true">🖼️</span>
          <span className="tool-name">Image Gen</span>
          <span className="tool-button tool-button-current" aria-label="Currently using this tool">Current Tool</span>
        </Link>
        
        <div className="tool-card tool-card-soon" role="listitem">
          <span className="tool-icon" aria-hidden="true">🎬</span>
          <span className="tool-name">Video</span>
          <span className="tool-status" aria-label="Coming in the future">Coming Soon</span>
        </div>
        
        <Link href="https://emoticons.deepvortexai.art" className="tool-card tool-card-available no-underline" role="listitem">
          <span className="available-badge" aria-label="This tool is available">✅ Available</span>
          <span className="tool-icon" aria-hidden="true">😊</span>
          <span className="tool-name">Emoticons</span>
          <span className="tool-button tool-button-link" aria-label="Open emoticons tool">Open Emoticons</span>
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
          position: relative;
        }

        .tool-card-available {
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.05);
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

        .tool-card-available:hover {
          border-color: #E8C87C;
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
        }
        
        .available-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid #10b981;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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

        .tool-button {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .tool-button-current {
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .tool-button-link {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .tool-card-available:hover .tool-button-link {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
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
          
          .tool-status, .tool-button {
            font-size: 0.7rem;
            padding: 0.3rem 0.6rem;
          }
          
          .available-badge {
            font-size: 0.6rem;
            padding: 0.25rem 0.5rem;
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
