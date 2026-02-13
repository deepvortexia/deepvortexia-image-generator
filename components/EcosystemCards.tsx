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
            <Tag key={i} href={isLink ? tool.href : undefined} className={`tool-card ${tool.status} ${tool.isCurrent ? 'current' : ''}`}>
              <div className="badge">{isLink ? "✅ Available" : ""}</div>
              <div className="icon">{tool.icon}</div>
              <div className="name">{tool.name}</div>
              <div className={`btn ${tool.isCurrent ? 'gold' : isLink ? 'green' : 'gray'}`}>{tool.btn}</div>
            </Tag>
          );
        })}
      </div>

      <style jsx>{`
        .tools-preview-section { padding: 2rem 1rem; max-width: 1000px; margin: 0 auto; }
        .tools-preview-title { font-family: 'Orbitron', sans-serif; color: #D4AF37; text-align: center; margin-bottom: 2rem; font-size: 1.4rem; }
        .tools-preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .tool-card { 
          background: rgba(15, 15, 15, 0.9); border: 1px solid rgba(212, 175, 55, 0.2); 
          border-radius: 12px; padding: 1.5rem 0.5rem; display: flex; flex-direction: column; 
          align-items: center; text-decoration: none; min-height: 200px; justify-content: space-between;
        }
        .tool-card.current { border: 2px solid #D4AF37; }
        .badge { height: 15px; font-size: 0.6rem; color: #10b981; font-weight: bold; }
        .icon { font-size: 2.2rem; }
        .name { font-family: 'Orbitron', sans-serif; color: #fff; font-size: 1rem; }
        .btn { font-size: 0.7rem; font-weight: 800; padding: 6px; border-radius: 4px; width: 90%; text-align: center; border: 1px solid; }
        .gold { color: #D4AF37; border-color: #D4AF37; }
        .green { color: #10b981; border-color: #10b981; }
        .gray { color: #444; border-color: #333; }
        @media (max-width: 800px) { .tools-preview-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}
