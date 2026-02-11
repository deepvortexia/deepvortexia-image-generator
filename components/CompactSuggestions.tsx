interface CompactSuggestionsProps {
  onStyleSelect: (style: string) => void;
  onIdeaSelect: (prompt: string) => void;
}

const popularStyles = [
  { emoji: '📸', text: 'Photorealistic', value: 'photorealistic' },
  { emoji: '🎨', text: 'Digital Art', value: 'digital art' },
  { emoji: '🖼️', text: 'Oil Painting', value: 'oil painting' },
  { emoji: '✏️', text: 'Sketch', value: 'pencil sketch' },
  { emoji: '🌈', text: 'Watercolor', value: 'watercolor' },
  { emoji: '🎭', text: 'Surreal', value: 'surrealist' },
  { emoji: '💎', text: '3D Render', value: '3D render' },
  { emoji: '🔮', text: 'Fantasy', value: 'fantasy art' }
];

const quickIdeas = [
  { emoji: '🏔️', text: 'Landscape', prompt: 'Mountain sunset golden light' },
  { emoji: '👤', text: 'Portrait', prompt: 'Cinematic portrait dramatic lighting' },
  { emoji: '🎭', text: 'Abstract', prompt: 'Colorful abstract fluid art' },
  { emoji: '🏙️', text: 'Cyberpunk', prompt: 'Neon cyberpunk city night' },
  { emoji: '🌌', text: 'Space', prompt: 'Nebula stars deep space' },
  { emoji: '🐾', text: 'Animals', prompt: 'Majestic lion wild savanna' },
  { emoji: '🍕', text: 'Food', prompt: 'Gourmet dish food photography' },
  { emoji: '🏠', text: 'Interior', prompt: 'Modern luxury interior design' }
];

const mobileSuggestions = [
  { emoji: '✨', text: 'sparkle', value: 'sparkling' },
  { emoji: '🎨', text: 'neon', value: 'neon' },
  { emoji: '🔮', text: 'mystical', value: 'mystical' },
  { emoji: '⚡', text: 'electric', value: 'electric' },
  { emoji: '🏔️', text: 'landscape', value: 'landscape' },
  { emoji: '🏙️', text: 'urban', value: 'urban' },
  { emoji: '🌌', text: 'space', value: 'space' },
  { emoji: '🐾', text: 'animals', value: 'animals' }
];

export default function CompactSuggestions({ onStyleSelect, onIdeaSelect }: CompactSuggestionsProps) {
  return (
    <div className="suggestions-compact-section">
      {/* Desktop: Show both rows */}
      <div className="suggestion-row suggestion-row-desktop">
        <h4 className="suggestion-row-title">🔥 Popular Styles</h4>
        <div className="suggestion-tags-compact">
          {popularStyles.map((item) => (
            <button
              key={item.text}
              className="suggestion-tag-compact"
              onClick={() => onStyleSelect(item.value)}
              aria-label={`Quick suggestion: ${item.text}`}
            >
              <span className="tag-emoji" aria-hidden="true">{item.emoji}</span>
              <span className="tag-text">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="suggestion-row suggestion-row-desktop">
        <h4 className="suggestion-row-title">💡 Quick Ideas</h4>
        <div className="suggestion-tags-compact">
          {quickIdeas.map((item) => (
            <button
              key={item.text}
              className="suggestion-tag-compact"
              onClick={() => onIdeaSelect(item.prompt)}
              aria-label={`Quick suggestion: ${item.text}`}
            >
              <span className="tag-emoji" aria-hidden="true">{item.emoji}</span>
              <span className="tag-text">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Show only one combined row */}
      <div className="suggestion-row suggestion-row-mobile">
        <h4 className="suggestion-row-title">🔥 Popular</h4>
        <div className="suggestion-tags-compact suggestion-tags-mobile">
          {mobileSuggestions.map((item) => (
            <button
              key={item.text}
              className="suggestion-tag-compact"
              onClick={() => onStyleSelect(item.value)}
              aria-label={`Quick suggestion: ${item.text}`}
            >
              <span className="tag-emoji" aria-hidden="true">{item.emoji}</span>
              <span className="tag-text">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .suggestions-compact-section {
          padding: 1rem 1rem 0.8rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .suggestion-row {
          margin-bottom: 1.5rem;
        }

        .suggestion-row:last-child {
          margin-bottom: 0;
        }

        .suggestion-row-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(212, 175, 55, 0.6);
          text-align: center;
          margin-bottom: 0.8rem;
          letter-spacing: 0.02em;
        }

        .suggestion-tags-compact {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .suggestion-tag-compact {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(5px);
        }

        .suggestion-tag-compact:hover {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.6);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
        }

        .suggestion-tag-compact:active {
          transform: translateY(0);
        }

        .suggestion-tag-compact .tag-emoji {
          font-size: 1rem;
          line-height: 1;
        }

        .suggestion-tag-compact .tag-text {
          line-height: 1;
        }

        .suggestion-row-desktop {
          display: block;
        }

        .suggestion-row-mobile {
          display: none;
        }

        @media (max-width: 767px) {
          .suggestion-row-desktop {
            display: none;
          }
          
          .suggestion-row-mobile {
            display: block;
          }
          
          .suggestion-row-mobile .suggestion-tags-mobile {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.6rem;
          }
          
          .suggestion-tag-compact {
            width: 100%;
            justify-content: center;
            padding: 0.6rem 0.8rem;
          }
          
          .suggestions-compact-section {
            padding: 1rem 0.5rem 0.8rem;
          }
          
          .suggestion-row-title {
            font-size: 0.75rem;
            margin-bottom: 0.7rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .suggestions-compact-section {
            padding: 0.9rem 1rem 0.7rem;
          }
          
          .suggestion-tags-compact {
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .suggestions-compact-section {
            padding: 0.8rem 0.5rem 0.6rem;
          }
          
          .suggestion-row {
            margin-bottom: 1.2rem;
          }
          
          .suggestion-row-title {
            font-size: 0.7rem;
            margin-bottom: 0.6rem;
          }
          
          .suggestion-tags-compact {
            gap: 0.5rem;
          }
          
          .suggestion-tag-compact {
            padding: 0.5rem 0.6rem;
            font-size: 0.8rem;
          }
          
          .suggestion-tag-compact .tag-emoji {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
