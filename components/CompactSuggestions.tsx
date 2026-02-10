interface CompactSuggestionsProps {
  onStyleSelect: (style: string) => void;
  onIdeaSelect: (prompt: string) => void;
}

const popularStyles = [
  { emoji: '📸', text: 'Photorealistic', value: 'photorealistic style' },
  { emoji: '🎨', text: 'Digital Art', value: 'digital art style' },
  { emoji: '🖼️', text: 'Oil Painting', value: 'oil painting style' },
  { emoji: '✏️', text: 'Sketch', value: 'pencil sketch style' },
  { emoji: '🌈', text: 'Watercolor', value: 'watercolor painting style' },
  { emoji: '🎭', text: 'Surreal', value: 'surrealist art style' },
  { emoji: '💎', text: '3D Render', value: '3D rendered style' },
  { emoji: '🔮', text: 'Fantasy', value: 'fantasy art style' }
];

const quickIdeas = [
  { emoji: '🏔️', text: 'Landscape', prompt: 'Breathtaking mountain landscape at sunset' },
  { emoji: '👤', text: 'Portrait', prompt: 'Professional portrait with cinematic lighting' },
  { emoji: '🎭', text: 'Abstract', prompt: 'Abstract composition with flowing colors' },
  { emoji: '🏙️', text: 'Urban', prompt: 'Futuristic cyberpunk city at night' },
  { emoji: '🌌', text: 'Space', prompt: 'Stunning view of space with nebulas' },
  { emoji: '🐾', text: 'Animals', prompt: 'Majestic lion in the wild' },
  { emoji: '🍕', text: 'Food', prompt: 'Professional food photography' },
  { emoji: '🏛️', text: 'Architecture', prompt: 'Modern architectural masterpiece' }
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
          margin-bottom: 1rem;
        }

        .suggestion-row:last-child {
          margin-bottom: 0;
        }

        .suggestion-row-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(212, 175, 55, 0.8);
          text-align: center;
          margin-bottom: 0.6rem;
          letter-spacing: 0.02em;
        }

        .suggestion-tags-compact {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          align-items: center;
        }

        .suggestion-tag-compact {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.8rem;
          background: rgba(26, 26, 26, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          color: rgba(232, 200, 124, 0.9);
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(5px);
        }

        .suggestion-tag-compact:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.5);
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
            gap: 0.5rem;
          }
          
          .suggestion-tag-compact {
            width: 100%;
            justify-content: center;
          }
          
          .suggestions-compact-section {
            padding: 1rem 0.5rem 0.8rem;
          }
          
          .suggestion-row-title {
            font-size: 0.9rem;
            margin-bottom: 0.6rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .suggestions-compact-section {
            padding: 0.9rem 1rem 0.7rem;
          }
          
          .suggestion-tags-compact {
            gap: 0.45rem;
          }
        }

        @media (max-width: 480px) {
          .suggestions-compact-section {
            padding: 0.8rem 0.5rem 0.6rem;
          }
          
          .suggestion-row {
            margin-bottom: 0.8rem;
          }
          
          .suggestion-row-title {
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
          }
          
          .suggestion-tags-compact {
            gap: 0.4rem;
          }
          
          .suggestion-tag-compact {
            padding: 0.4rem 0.7rem;
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
