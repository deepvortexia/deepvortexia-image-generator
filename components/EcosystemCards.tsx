import Link from "next/link";

export default function EcosystemCards() {
  // L'ordre exact et les données de ton HubPortal.tsx
  const previewToolsList = [
    {
      iconSymbol: '😃',
      toolName: 'Emoticons',
      toolDescription: 'Custom emoji creation',
      statusLabel: 'Available Now',
      isActive: true,
      targetUrl: 'https://emoticons.deepvortexai.art',
      isCurrent: false
    },
    {
      iconSymbol: '🖼️',
      toolName: 'Image Gen',
      toolDescription: 'AI artwork',
      statusLabel: 'Available Now',
      isActive: true,
      targetUrl: 'https://images.deepvortexai.art/',
      isCurrent: true // Onglet avec le Glow
    },
    {
      iconSymbol: '🎨',
      toolName: 'Remove Background',
      toolDescription: 'Remove backgrounds from images instantly with AI precision',
      statusLabel: 'Coming Soon',
      isActive: false
    },
    {
      iconSymbol: '✨',
      toolName: 'More Tools',
      toolDescription: 'Expanding soon',
      statusLabel: 'In Development',
      isActive: false
    }
  ];

  return (
    <section className="preview-tools-section">
      <h2 className="section-heading">Complete AI Ecosystem</h2>
      <div className="preview-tools-grid">
        {previewToolsList.map((tool, idx) => {
          const cardClass = `preview-card ${tool.isActive ? 'card-active' : 'card-inactive'} ${tool.isCurrent ? 'current-tool-glow' : ''}`;
          
          const CardContent = (
            <>
              <div className="preview-icon">{tool.iconSymbol}</div>
              <h3 className="preview-title">{tool.toolName}</h3>
              <p className="preview-desc">{tool.toolDescription}</p>
              <div className="status-container">
                <span className={`status-badge ${tool.isActive ? 'badge-active' : 'badge-upcoming'}`}>
                  {tool.statusLabel}
                </span>
                {tool.isCurrent && <div className="current-tool-label">CURRENT TOOL</div>}
              </div>
            </>
          );

          return tool.isActive ? (
            <Link key={idx} href={tool.targetUrl || "#"} className={cardClass} style={{ textDecoration: 'none' }}>
              {CardContent}
            </Link>
          ) : (
            <div key={idx} className={cardClass}>
              {CardContent}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .preview-tools-section { padding: 4rem 1rem; max-width: 1200px; margin: 0 auto; }
        .section-heading { font-family: 'Orbitron', sans-serif; font-size: 2rem; text-align: center; margin-bottom: 3rem; color: #D4AF37; }
        
        /* Grille identique au Hub */
        .preview-tools-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 1.5rem; 
        }

        /* Styles extraits de ton HubPortal.css */
        .preview-card {
          background: rgba(26, 26, 26, 0.8) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 300px;
          justify-content: space-between;
          color: white;
        }

        /* Effet GLOW Doré */
        .current-tool-glow {
          border: 2px solid #D4AF37 !important;
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.1) !important;
          background: rgba(212, 175, 55, 0.05) !important;
        }

        .preview-card.card-active:hover {
          border-color: #D4AF37 !important;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
        }

        .preview-icon { font-size: 3rem; margin-bottom: 1rem; }
        .preview-title { font-family: 'Orbitron', sans-serif; font-size: 1.3rem; color: #fff; margin-bottom: 0.5rem; }
        .preview-desc { font-size: 0.9rem; color: #888; margin-bottom: 1rem; line-height: 1.4; }
        
        .status-container { display: flex; flex-direction: column; gap: 0.8rem; width: 100%; align-items: center; }
        .status-badge { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; border: 1px solid; }
        
        .badge-active { background: rgba(46, 204, 113, 0.2); color: #2ecc71; border-color: #2ecc71; }
        .badge-upcoming { background: rgba(241, 196, 15, 0.2); color: #f1c40f; border-color: #f1c40f; }

        .current-tool-label { font-size: 0.7rem; font-weight: 800; color: #D4AF37; border: 1px solid #D4AF37; padding: 0.3rem 0.8rem; border-radius: 4px; background: rgba(212, 175, 55, 0.1); }

        @media (max-width: 1024px) { .preview-tools-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .preview-tools-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
