import Link from "next/link";

interface NavigationTab {
  iconSymbol: string;
  toolName: string;
  toolDescription: string;
  statusLabel: string;
  isActive: boolean;
  targetUrl?: string;
}

const navigationTabs: NavigationTab[] = [
  {
    iconSymbol: '😀',
    toolName: 'Emoticons',
    toolDescription: 'Custom emoji creation',
    statusLabel: 'Available Now',
    isActive: true,
    targetUrl: 'https://emoticons.deepvortexai.art'
  },
  {
    iconSymbol: '🖼️',
    toolName: 'Image Gen',
    toolDescription: 'AI artwork',
    statusLabel: 'Available Now',
    isActive: true,
    targetUrl: '/' // Page actuelle
  },
  {
    iconSymbol: '🎬',
    toolName: 'Video',
    toolDescription: 'Create stunning AI-generated videos from text prompts',
    statusLabel: 'Coming Soon',
    isActive: false
  },
  {
    iconSymbol: '🎨',
    toolName: 'Remove Background',
    toolDescription: 'Remove backgrounds from images instantly with AI precision',
    statusLabel: 'Coming Soon',
    isActive: false
  }
];

export default function NavigationTabs() {
  return (
    <nav className="navigation-tabs-section" role="navigation" aria-label="AI Tools Navigation">
      <div className="navigation-tabs-container">
        {navigationTabs.map((tab) => {
          const isCurrentPage = tab.targetUrl === '/';
          
          if (tab.isActive && tab.targetUrl) {
            return (
              <Link 
                key={tab.toolName}
                href={tab.targetUrl} 
                className={`nav-tool-card ${isCurrentPage ? 'nav-tool-card-current' : 'nav-tool-card-available'}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                <div className="nav-tool-content">
                  {tab.statusLabel === 'Available Now' && (
                    <span className="nav-status-badge nav-status-available" aria-label={tab.statusLabel}>
                      {tab.statusLabel}
                    </span>
                  )}
                  <span className="nav-tool-icon" aria-hidden="true">{tab.iconSymbol}</span>
                  <div className="nav-tool-info">
                    <span className="nav-tool-name">{tab.toolName}</span>
                    <span className="nav-tool-description">{tab.toolDescription}</span>
                  </div>
                </div>
              </Link>
            );
          }
          
          return (
            <div 
              key={tab.toolName}
              className="nav-tool-card nav-tool-card-disabled"
              aria-disabled="true"
            >
              <div className="nav-tool-content">
                <span className="nav-status-badge nav-status-soon" aria-label={tab.statusLabel}>
                  {tab.statusLabel}
                </span>
                <span className="nav-tool-icon" aria-hidden="true">{tab.iconSymbol}</span>
                <div className="nav-tool-info">
                  <span className="nav-tool-name">{tab.toolName}</span>
                  <span className="nav-tool-description">{tab.toolDescription}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .navigation-tabs-section {
          padding: 1.5rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .navigation-tabs-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .nav-tool-card {
          display: flex;
          flex-direction: column;
          position: relative;
          padding: 1.75rem 1.25rem;
          background: rgba(26, 26, 26, 0.7);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          text-decoration: none;
          cursor: default;
          overflow: hidden;
        }

        .nav-tool-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .nav-tool-card-current {
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.08);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.25), inset 0 1px 0 rgba(212, 175, 55, 0.2);
          cursor: default;
        }

        .nav-tool-card-current::before {
          opacity: 1;
        }

        .nav-tool-card-available {
          cursor: pointer;
        }

        .nav-tool-card-available:hover {
          transform: translateY(-4px);
          border-color: #E8C87C;
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        .nav-tool-card-available:hover::before {
          opacity: 1;
        }

        .nav-tool-card-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .nav-tool-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          position: relative;
        }

        .nav-status-badge {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1;
          z-index: 1;
        }

        .nav-status-available {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1.5px solid rgba(16, 185, 129, 0.5);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
        }

        .nav-status-soon {
          background: rgba(212, 175, 55, 0.1);
          color: rgba(212, 175, 55, 0.8);
          border: 1.5px solid rgba(212, 175, 55, 0.3);
        }

        .nav-tool-icon {
          font-size: 3.5rem;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          margin-bottom: 0.25rem;
        }

        .nav-tool-card-current .nav-tool-icon {
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .nav-tool-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }

        .nav-tool-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #E8C87C;
          letter-spacing: 0.02em;
        }

        .nav-tool-card-current .nav-tool-name {
          color: #D4AF37;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
        }

        .nav-tool-description {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.65);
          max-width: 220px;
        }

        .nav-tool-card-current .nav-tool-description {
          color: rgba(255, 255, 255, 0.75);
        }

        /* Tablet: 2 columns */
        @media (max-width: 768px) {
          .navigation-tabs-section {
            padding: 1.25rem 1rem;
          }

          .navigation-tabs-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .nav-tool-card {
            padding: 1.5rem 1rem;
          }

          .nav-tool-icon {
            font-size: 3rem;
          }

          .nav-tool-name {
            font-size: 1.05rem;
          }

          .nav-tool-description {
            font-size: 0.8rem;
          }

          .nav-status-badge {
            font-size: 0.65rem;
            padding: 0.35rem 0.65rem;
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 480px) {
          .navigation-tabs-section {
            padding: 1rem 0.75rem;
          }

          .navigation-tabs-container {
            grid-template-columns: 1fr;
            gap: 0.875rem;
          }

          .nav-tool-card {
            padding: 1.25rem 1rem;
          }

          .nav-tool-icon {
            font-size: 2.75rem;
          }

          .nav-tool-name {
            font-size: 1rem;
          }

          .nav-tool-description {
            font-size: 0.75rem;
            max-width: 280px;
          }
        }

        /* Large screens: maintain max width */
        @media (min-width: 1280px) {
          .navigation-tabs-container {
            gap: 1.5rem;
          }

          .nav-tool-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </nav>
  );
}
