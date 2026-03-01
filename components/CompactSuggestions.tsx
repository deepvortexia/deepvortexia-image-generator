interface CompactSuggestionsProps {
  onStyleSelect: (style: string) => void;
  onIdeaSelect: (prompt: string) => void;
}

const popularStyles = [
  { emoji: '📸', text: 'Photorealistic', value: 'Hyperrealistic portrait golden hour dramatic lighting' },
  { emoji: '🎨', text: 'Digital Art', value: 'Futuristic neon cityscape glowing cyberpunk atmosphere' },
  { emoji: '🖼️', text: 'Oil Painting', value: 'Majestic mountain landscape rich textured brushstrokes' },
  { emoji: '✏️', text: 'Sketch', value: 'Intricate detailed pencil drawing mysterious cloaked figure' },
  { emoji: '🌈', text: 'Watercolor', value: 'Dreamy ethereal forest soft pastel flowing colors' },
  { emoji: '🎭', text: 'Surreal', value: 'Cosmic dreamscape melting reality infinite surreal dimensions' },
  { emoji: '💎', text: '3D Render', value: 'Sleek metallic sculpture floating against dark void' },
  { emoji: '🔮', text: 'Fantasy', value: 'Ancient dragon soaring above mystical glowing castle' }
];

const quickIdeas = [
  { emoji: '🏔️', text: 'Landscape', prompt: 'Epic volcanic sunset dramatic stormy sky mountains' },
  { emoji: '👤', text: 'Portrait', prompt: 'Mysterious hooded figure glowing eyes dark forest' },
  { emoji: '🎭', text: 'Abstract', prompt: 'Swirling cosmic energy vibrant explosive colors' },
  { emoji: '🏙️', text: 'Cyberpunk', prompt: 'Neon rain soaked streets future Tokyo night' },
  { emoji: '🌌', text: 'Space', prompt: 'Nebula explosion massive supernova colorful universe' },
  { emoji: '🐾', text: 'Animals', prompt: 'Majestic white wolf glowing eyes misty forest' },
  { emoji: '🍕', text: 'Food', prompt: 'Luxurious chocolate lava cake golden caramel drizzle' },
  { emoji: '🏠', text: 'Interior', prompt: 'Minimalist luxury penthouse golden sunset panoramic view' }
];

const mobileSuggestions = [
  { emoji: '✨', text: 'sparkle', value: 'Glittering magical sparkles ethereal light particles floating air' },
  { emoji: '🎨', text: 'neon', value: 'Vibrant neon signs rain reflection dark urban street' },
  { emoji: '🔮', text: 'mystical', value: 'Ancient mystical ruins glowing runes misty dark atmosphere' },
  { emoji: '⚡', text: 'electric', value: 'Massive electric storm lightning strikes dramatic dark stormy sky' },
  { emoji: '🏔️', text: 'landscape', value: 'Epic panoramic mountain vista golden sunset dramatic clouds' },
  { emoji: '🏙️', text: 'urban', value: 'Busy metropolitan skyline golden hour stunning architectural beauty' },
  { emoji: '🌌', text: 'space', value: 'Deep space colorful nebula ancient star formation galaxy' },
  { emoji: '🐾', text: 'animals', value: 'Majestic tiger prowling through lush jungle misty morning' }
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
