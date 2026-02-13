import Link from "next/link";

export default function EcosystemCards() {
  const tools = [
    { name: "Emoticons", icon: "😃", status: "available", href: "https://emoticons.deepvortexai.art", btn: "OPEN EMOTICONS", isCurrent: false },
    { name: "Video", icon: "🎥", status: "soon", href: "#", btn: "COMING SOON", isCurrent: false },
    { name: "Image Gen", icon: "🖼️", status: "available", href: "https://images.deepvortexai.art/", btn: "CURRENT TOOL", isCurrent: true },
    { name: "AI Chat", icon: "💬", status: "soon", href: "#", btn: "COMING SOON", isCurrent: false }
  ];

  return (
    <section className="tools-preview-section">
      <h3 className="tools-preview-title">Complete AI Ecosystem</h3>
      <div className="tools-preview-grid">
        {tools.map((tool, i) => {
          const isAvailable = tool.status === "available";
          // On utilise une div si l'outil n'est pas dispo pour éviter les erreurs de Link
          const CardContent = (
            <div className={`tool-card ${tool.status} ${tool.isCurrent ? 'active' : ''}`}>
              <div className="badge">{isAvailable ? "✅ Available" : ""}</div>
              <div className="icon">{tool.icon}</div>
              <div className="name">{tool.name}</div>
              <div className={`btn ${tool.isCurrent ? 'gold' : isAvailable ? 'green' : 'gray'}`}>
                {tool.btn}
              </div>
            </div>
          );

          return isAvailable ? (
            <Link key={i} href={tool.href} style={{ textDecoration: 'none' }}>
              {CardContent}
            </Link>
          ) : (
            <div key={i}>{CardContent}</div>
          );
        })}
      </div>

      <style jsx>{`
        .tools-preview-section { padding: 40px 20px; max-width: 1000px; margin: 0 auto; }
        .tools-preview-title { font-family: 'Orbitron', sans-serif; color: #D4AF37; text-align: center; margin-bottom: 30px; }
        .tools-preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        .tool-card { 
          background: #0a0a0a; border: 1px solid #222; border-radius: 12px; 
          padding: 25px 10px; display: flex; flex-direction: column; 
          align-items: center; min-height: 200px; justify-content: space-between; transition: 0.3s;
        }
        .tool-card.active { border: 2px solid #D4AF37; background: rgba(212, 175, 55, 0.05); }
        .badge { height: 20px; font-size: 0.65rem; color: #10b981; font-weight: bold; }
        .icon { font-size: 2.5rem; }
        .name { font-family: 'Orbitron', sans-serif; color: #fff; font-size: 1rem; }
        .btn { font-size: 0.7rem; font-weight: 800; padding: 8px; border-radius: 6px; width: 90%; text-align: center; border: 1px solid; }
        .gold { color: #D4AF37; border-color: #D4AF37; }
        .green { color: #10b981; border-color: #10b981; }
        .gray { color: #444; border-color: #333; }
        @media (max-width: 900px) { .tools-preview-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}
