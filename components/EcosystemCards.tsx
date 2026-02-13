import Link from "next/link";

export default function EcosystemCards() {
  const tools = [
    {
      name: "Emoticons",
      icon: "😃",
      desc: "Custom emoji creation",
      status: "Available Now",
      isActive: true,
      href: "https://emoticons.deepvortexai.art",
      isCurrent: false
    },
    {
      name: "Image Gen",
      icon: "🖼️",
      desc: "AI artwork",
      status: "Available Now",
      isActive: true,
      href: "https://images.deepvortexai.art/",
      isCurrent: true // C'est l'outil actuel
    },
    {
      name: "Remove Background",
      icon: "🎨",
      desc: "Remove backgrounds from images instantly",
      status: "Coming Soon",
      isActive: false
    },
    {
      name: "More Tools",
      icon: "✨",
      desc: "Expanding soon",
      status: "In Development",
      isActive: false
    }
  ];

  return (
    <section className="preview-tools-section">
      <h2 className="section-heading">Complete AI Ecosystem</h2>
      <div className="preview-tools-grid">
        {tools.map((tool, idx) => {
          // On s'assure que le style s'applique à l'élément extérieur, peu importe son type
          const cardClasses = `preview-card ${tool.isActive ? 'card-active' : 'card-inactive'} ${tool.isCurrent ? 'glow-active' : ''}`;
          
          const CardContent = (
            <>
              <div className="preview-icon">{tool.icon}</div>
              <h3 className="preview-title">{tool.name}</h3>
              <p className="preview-desc">{tool.desc}</p>
              <div className="status-container">
                <span className={`status-badge ${tool.isActive ? 'badge-active' : 'badge-upcoming'}`}>
                  {tool.status}
                </span>
                {tool.isCurrent && <div className="current-tool-label">CURRENT TOOL</div>}
              </div>
            </>
          );

          return tool.isActive ? (
            <Link key={idx} href={tool.href || "#"} className={cardClasses} style={{ textDecoration: 'none' }}>
              {CardContent}
            </Link>
          ) : (
            <div key={idx} className={cardClasses}>
              {CardContent}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .preview-tools-section { padding: 4rem 1rem; max-width: 1200px; margin: 0 auto; }
        .section-heading { font-family: 'Orbitron', sans-serif; font-size: 2.2rem; text-align: center; margin-bottom: 3rem; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px; }
        
        /* Correction alignement : Grille de 4 colonnes fixe */
        .preview-tools-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }

        /* Style Hub Portal : Appliqué à TOUTES les cartes */
        .preview-card {
          background: rgba(26, 26, 26, 0.7) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
          border-radius: 16px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          transition: all 0.4s ease;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 300px;
          justify-content: space-between;
        }

        /* EFFET GLOW pour l'onglet CURRENT TOOL */
        .glow-active {
          border: 2px solid #D4AF37 !important;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.1) !important;
          background: rgba(212, 175, 55, 0.05) !important;
        }

        .preview-card.card-active:hover {
          border-color: #D4AF37;
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.3);
        }

        .preview-icon { font-size: 3.5rem; margin-bottom: 1rem; }
        .preview-title { font-family: 'Orbitron', sans-serif; font-size: 1.4rem; color: #fff; margin: 0.5rem 0; }
        .preview-desc { font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.5; margin-bottom: 1.5rem; }

        .status-container { display: flex; flex-direction: column; gap: 0.8rem; width: 100%; align-items: center; }
        .status-badge { padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border: 1px solid; }
        
        .badge-active { background: rgba(46, 204, 113, 0.2); color: #2ecc71; border-color: #2ecc71; }
        .badge-upcoming { background: rgba(241, 196, 15, 0.1); color: #f1c40f; border-color: rgba(241, 196, 15, 0.3); }

        .current-tool-label { font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 800; color: #D4AF37; border: 1px solid #D4AF37; padding: 0.3rem 0.8rem; border-radius: 4px; background: rgba(212, 175, 55, 0.1); }

        @media (max-width: 1024px) { .preview-tools-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .preview-tools-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
