import Link from "next/link";

export default function EcosystemCards() {
  // Configuration unique pour toutes les cartes (Ordre Image 1 + Icônes Hub)
  const tools = [
    { name: "Emoticons", icon: "😃", status: "available", href: "https://emoticons.deepvortexai.art", btn: "CURRENT TOOL", isCurrent: true },
    { name: "Video", icon: "🎥", status: "soon", btn: "COMING SOON" },
    { name: "Image Gen", icon: "🖼️", status: "available", href: "https://images.deepvortexai.art/", btn: "OPEN IMAGE GEN" },
    { name: "AI Chat", icon: "💬", status: "soon", btn: "COMING SOON" }
  ];

  return (
    <section className="tools-preview-section">
      <h3 className="tools-preview-title">Complete AI Ecosystem</h3>
      <div className="tools-preview-grid">
        {tools.map((tool, i) => {
          const isLink = tool.status === "available";
          const Tag = isLink ? Link : "div";
          
          return (
            <Tag key={i} href={isLink ? tool.href : undefined} 
                 className={`tool-card ${tool.status} ${tool.isCurrent ? 'current' : ''} ${!isLink ? 'no-link' : ''}`}>
              
              <div className="card-badge">{isLink ? "✅ Available" : ""}</div>
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-name">{tool.name}</div>
              
              <div className={`tool-btn ${tool.isCurrent ? 'gold' : isLink ? 'green' : 'gray'}`}>
                {tool.btn}
              </div>
            </Tag>
          );
        })}
      </div>

      <style jsx>{`
        .tools-preview-section { padding: 2rem 1rem; max-width: 1000px; margin: 0 auto; }
        .tools-preview-title { font-family: 'Orbitron', sans-serif; color: #D4AF37; text-align: center; margin-bottom: 2rem; font-size: 1.3rem; letter-spacing: 1px; }
        
        /* Grille de 4 colonnes parfaite */
        .tools-preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        
        .tool-card { 
            background: rgba(15, 15, 15, 0.9); border: 1px solid rgba(212, 175, 55, 0.2); 
            border-radius: 16px; padding: 1.5rem 0.5rem; display: flex; flex-direction: column; 
            align-items: center; text-decoration: none; transition: 0.3s ease; position: relative;
        }
        
        .tool-card.current { border: 2px solid #D4AF37; background: rgba(212, 175, 55, 0.05); }
        .tool-card.available:hover { transform: translateY(-5px); border-color: #D4AF37; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
        
        .card-badge { height: 20px; font-size: 0.65rem; color: #10b981; font-weight: 800; margin-bottom: 5px; }
        .tool-icon { font-size: 2.2rem; margin-bottom: 10px; }
        .tool-name { font-family: 'Orbitron', sans-serif; color: #fff; font-size: 1rem; margin-bottom: 15px; }
        
        .tool-btn { font-size: 0.7rem; font-weight: 800; padding: 6px 12px; border-radius: 6px; width: 85%; text-align: center; border: 1px solid; }
        .gold { color: #D4AF37; border-color: #D4AF37; background: rgba(212, 175, 55, 0.1); }
        .green { color: #10b981; border-color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .gray { color: #555; border-color: #333; background: transparent; }
        
        @media (max-width: 850px) { .tools-preview-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}
