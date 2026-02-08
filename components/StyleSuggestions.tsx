import { StyleSuggestion } from "@/types";

interface StyleSuggestionsProps {
  onSelect: (style: string) => void;
}

const styles: StyleSuggestion[] = [
  { emoji: "✨", label: "Photorealistic", value: "photorealistic, highly detailed" },
  { emoji: "🎨", label: "Digital Art", value: "digital art, vibrant colors" },
  { emoji: "🌟", label: "Cinematic", value: "cinematic lighting, dramatic" },
  { emoji: "🔮", label: "Fantasy", value: "fantasy art, magical" },
  { emoji: "💎", label: "3D Render", value: "3D render, octane render" },
  { emoji: "🌈", label: "Vibrant", value: "vibrant, colorful, energetic" },
  { emoji: "🖤", label: "Dark & Moody", value: "dark, moody, atmospheric" },
  { emoji: "🌸", label: "Soft & Dreamy", value: "soft, dreamy, pastel colors" },
];

export default function StyleSuggestions({ onSelect }: StyleSuggestionsProps) {
  return (
    <div className="mb-6">
      <label 
        className="block text-sm font-medium mb-2"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: 'rgba(212, 175, 55, 0.8)',
          fontWeight: 600
        }}
      >
        Popular Styles
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {styles.map((style) => (
          <button
            key={style.label}
            onClick={() => onSelect(style.value)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap"
            style={{
              background: 'rgba(26, 26, 26, 0.6)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              color: 'rgba(232, 200, 124, 0.9)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 500,
              backdropFilter: 'blur(5px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 26, 26, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>{style.emoji}</span>
            <span>{style.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
