import { AspectRatio } from "@/types";

interface AspectRatioSelectorProps {
  value: string;
  onChange: (ratio: string) => void;
}

const ratios: AspectRatio[] = ["1:1", "4:3", "16:9", "9:16"];

export default function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Aspect Ratio
      </label>
      <div className="flex gap-2 flex-wrap">
        {ratios.map((ratio) => (
          <button
            key={ratio}
            onClick={() => onChange(ratio)}
            aria-pressed={value === ratio}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              value === ratio
                ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-400"
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
}
