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
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Quick Ideas
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ideas.map((idea) => (
          <button
            key={idea.label}
            onClick={() => onSelect(idea.prompt)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:border-yellow-400 transition-colors"
          >
            <span>{idea.emoji}</span>
            <span>{idea.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
