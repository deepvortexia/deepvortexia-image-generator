import Link from "next/link";

export default function EcosystemCards() {
  const tools = [
    { name: "Emoticons", icon: "😃", status: "available", href: "https://emoticons.deepvortexai.art", btn: "OPEN EMOTICONS", isCurrent: false },
    { name: "Video", icon: "🎥", status: "soon", btn: "COMING SOON", isCurrent: false },
    { name: "Image Gen", icon: "🖼️", status: "available", href: "https://images.deepvortexai.art/", btn: "CURRENT TOOL", isCurrent: true },
    { name: "AI Chat", icon: "💬", status: "soon", btn: "COMING SOON", isCurrent: false }
  ];

  return (
    <section className="tools-preview-section">
      <h3 className="tools-preview-title">Complete AI Ecosystem</h3>
      <div className="tools-preview-grid">
        {tools.map((tool, i) => {
          const isLink = tool.status === "available";
          const Tag = isLink ? Link : "div";
          return (
            <Tag key={i} href={isLink ? tool.href : undefined} className={`tool-card ${tool.status} ${tool.isCurrent ? 'active-tool' : ''}`}>
              <div className="status-indicator">{isLink ? "● Available" : "○ Soon"}</div>
              <div className="tool-icon-wrapper">{tool.icon}</div>
              <div className="tool-info">
                <span className="tool-name-text">{tool.name}</span>
                <div className={`action-label ${tool.isCurrent ? 'gold-label' : isLink ? 'green-label' : 'gray-label'}`}>
                  {tool.btn}
                </div>
              </div>
            </Tag>
          );
        })}
      </div>

      <style jsx>{`
        .tools-preview-section { padding: 40px 20px; max-width: 1100px; margin: 0 auto; }
        .tools-preview-title { font-family: 'Orbitron', sans-serif; color: #D4AF37; text-align: center; margin-bottom: 30px; font-size: 1.5rem; text-transform: uppercase; }
        
        .tools-preview-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 20px; 
        }

        .tool-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          min-height: 180px;
          transition: 0.3s;
        }

        .tool-card.active-tool { border: 2px solid #D4AF37; background: rgba(212, 175, 55, 0.05); }
        .tool-card.available:hover { border-color: #D4AF37; transform: translateY(-5px); }

        .status-indicator { font-size: 0.65rem; color: #10b981; margin-bottom: 10px; font-weight: bold; }
        .tool-icon-wrapper { font-size: 2.5rem; margin-bottom: 10px; }
        
        .tool-info { text-align: center; width: 100%; }
        .tool-name-text { font-family: 'Orbitron', sans-serif; color: #fff; display: block; margin-bottom: 15px; font-size: 1rem; }

        .action-label {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid;
          text-align: center;
        }

        .gold-label { color: #D4AF37; border-color: #D4AF37; background: rgba(212, 175, 55, 0.1); }
        .green-label { color: #10b981; border-color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .gray-label { color: #444; border-color: #333; }

        @media (max-width: 900px) { .tools-preview-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}
