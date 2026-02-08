interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="mb-6">
      <label 
        htmlFor="prompt-input" 
        className="block text-sm font-medium mb-2"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: 'rgba(212, 175, 55, 0.8)',
          fontWeight: 600
        }}
      >
        Describe your image
      </label>
      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the image you want to create..."
        disabled={disabled}
        rows={4}
        className="w-full px-4 py-3 rounded-lg resize-none transition-all"
        style={{
          background: 'rgba(10, 10, 10, 0.6)',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          color: '#E8C87C',
          fontFamily: "'Inter', sans-serif",
          fontSize: '1.05rem'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#D4AF37';
          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.15)';
          e.currentTarget.style.background = 'rgba(10, 10, 10, 0.8)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.background = 'rgba(10, 10, 10, 0.6)';
        }}
      />
    </div>
  );
}
