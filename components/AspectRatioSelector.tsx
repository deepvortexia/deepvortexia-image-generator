import { AspectRatio } from "@/types";

interface AspectRatioSelectorProps {
  value: string;
  onChange: (ratio: string) => void;
}

const ratios: AspectRatio[] = ["1:1", "4:3", "16:9", "9:16"];

export default function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
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
        Aspect Ratio
      </label>
      <div className="flex gap-2 flex-wrap">
        {ratios.map((ratio) => (
          <button
            key={ratio}
            onClick={() => onChange(ratio)}
            aria-pressed={value === ratio}
            className="px-4 py-2 rounded-lg border transition-all"
            style={{
              background: value === ratio ? 'linear-gradient(135deg, #D4AF37, #E8C87C)' : 'rgba(26, 26, 26, 0.6)',
              color: value === ratio ? '#0a0a0a' : 'rgba(232, 200, 124, 0.9)',
              borderColor: value === ratio ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: value === ratio ? 700 : 500,
              backdropFilter: 'blur(5px)'
            }}
            onMouseEnter={(e) => {
              if (value !== ratio) {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (value !== ratio) {
                e.currentTarget.style.background = 'rgba(26, 26, 26, 0.6)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              }
            }}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
}
