import { QuickIdea } from "@/types";

interface QuickIdeasProps {
  onSelect: (prompt: string) => void;
}

const ideas: QuickIdea[] = [
  { emoji: "🏔️", label: "Landscape", prompt: "A breathtaking mountain landscape at sunset" },
  { emoji: "👤", label: "Portrait", prompt: "A professional portrait with cinematic lighting" },
  { emoji: "🎭", label: "Abstract", prompt: "An abstract composition with flowing colors" },
  { emoji: "🏙️", label: "Urban", prompt: "A futuristic cyberpunk city at night" },
  { emoji: "🌌", label: "Space", prompt: "A stunning view of space with nebulas and stars" },
  { emoji: "🐾", label: "Animals", prompt: "A majestic lion in the wild" },
  { emoji: "🍕", label: "Food", prompt: "Professional food photography of a gourmet dish" },
  { emoji: "🏛️", label: "Architecture", prompt: "Modern architectural masterpiece" },
];

export default function QuickIdeas({ onSelect }: QuickIdeasProps) {
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
        Quick Ideas
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ideas.map((idea) => (
          <button
            key={idea.label}
            onClick={() => onSelect(idea.prompt)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
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
            <span>{idea.emoji}</span>
            <span>{idea.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
