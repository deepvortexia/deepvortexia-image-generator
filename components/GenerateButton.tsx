interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function GenerateButton({ onClick, isLoading, disabled }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full py-4 px-6 font-bold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      style={{
        background: isLoading || disabled ? 'rgba(212, 175, 55, 0.3)' : 'linear-gradient(135deg, #D4AF37, #E8C87C)',
        color: '#0a0a0a',
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 700,
        letterSpacing: '0.05em',
        border: 'none',
        boxShadow: isLoading || disabled ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.4)',
        transform: 'translateZ(0)'
      }}
      onMouseEnter={(e) => {
        if (!isLoading && !disabled) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #E8C87C, #F4D88A)';
          e.currentTarget.style.transform = 'translateY(-3px) translateZ(0)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.6)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading && !disabled) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37, #E8C87C)';
          e.currentTarget.style.transform = 'translateZ(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
        }
      }}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <span>⚡</span>
          <span>Generate Image</span>
        </>
      )}
    </button>
  );
}
