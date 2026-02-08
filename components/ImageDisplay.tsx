interface ImageDisplayProps {
  imageUrl: string;
  isLoading: boolean;
  error: string;
}

export default function ImageDisplay({ imageUrl, isLoading, error }: ImageDisplayProps) {
  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download image. Please try right-clicking and "Save Image As..."');
    }
  };

  if (isLoading) {
    return (
      <div 
        className="mt-8 flex flex-col items-center justify-center py-12 rounded-lg"
        style={{
          background: 'rgba(26, 26, 26, 0.6)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <svg className="animate-spin h-12 w-12 mb-4" style={{ color: '#D4AF37' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg" style={{ color: '#E8C87C', fontFamily: "'Inter', sans-serif" }}>Generating your image...</p>
        <p className="text-sm mt-2" style={{ color: 'rgba(232, 200, 124, 0.6)' }}>This usually takes 2-5 seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="mt-8 p-6 rounded-lg"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgba(239, 68, 68, 0.5)'
        }}
      >
        <div className="flex items-center gap-2" style={{ color: '#EF4444' }}>
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="mt-8">
        <div 
          className="rounded-lg p-4"
          style={{
            background: 'rgba(26, 26, 26, 0.6)',
            border: '2px solid #D4AF37',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Generated AI image"
            className="w-full max-w-3xl mx-auto rounded-lg"
            loading="lazy"
          />
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={downloadImage}
            className="px-6 py-3 font-bold rounded-lg transition-all flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #E8C87C)',
              color: '#0a0a0a',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #E8C87C, #F4D88A)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37, #E8C87C)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
            }}
          >
            <span>⬇️</span>
            <span>Download Image</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
