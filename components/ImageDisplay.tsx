interface ImageDisplayProps {
  imageUrl: string;
  isLoading: boolean;
  error: string;
  onRegenerate?: () => void;
}

export default function ImageDisplay({ imageUrl, isLoading, error, onRegenerate }: ImageDisplayProps) {
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
      <div className="loading-section">
        <div className="loading-spinner-large"></div>
        <p className="loading-message">Creating magic... ✨</p>
        <p className="loading-hint">This usually takes 2-5 seconds</p>
        
        <style jsx>{`
          .loading-section {
            text-align: center;
            padding: 60px 20px;
            animation: fadeIn 0.5s ease;
          }

          .loading-spinner-large {
            width: 100px;
            height: 100px;
            margin: 0 auto 30px;
            position: relative;
          }

          .loading-spinner-large::before {
            content: '';
            width: 100px;
            height: 100px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--gold-primary);
            border-right-color: var(--gold-light);
            border-radius: 50%;
            position: absolute;
            animation: spin 1.5s linear infinite;
          }

          .loading-spinner-large::after {
            content: '';
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--gold-dark), var(--gold-primary));
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) translateZ(0);
            box-shadow: 0 0 30px var(--glow-gold), 0 0 50px var(--glow-gold-strong);
            animation: pulse 2s ease-in-out infinite;
            will-change: transform;
          }

          @keyframes pulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1) translateZ(0);
              box-shadow: 0 0 30px var(--glow-gold), 0 0 50px var(--glow-gold-strong);
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2) translateZ(0);
              box-shadow: 0 0 40px var(--glow-gold), 0 0 70px var(--glow-gold-strong);
            }
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading-message {
            font-size: 20px;
            color: var(--text-primary);
            font-weight: 600;
            margin-bottom: 10px;
            text-shadow: 0 0 10px var(--glow-gold);
          }

          .loading-hint {
            font-size: 14px;
            color: var(--text-secondary);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <span className="error-icon">⚠️</span>
        {error}
        
        <style jsx>{`
          .error-message {
            padding: 1rem;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid var(--error);
            border-radius: 8px;
            color: var(--error);
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            animation: fadeIn 0.3s ease;
            max-width: 600px;
          }

          .error-icon {
            font-size: 20px;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="result-section slide-up">
        <h2 className="result-title">
          Your Image ✨
          <span className="generation-time">Generated</span>
        </h2>
        
        <div className="image-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Generated AI image"
            className="generated-image fade-in-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        
        <div className="action-buttons">
          <button onClick={downloadImage} className="action-btn download-btn">
            <span>📥</span> Download
          </button>
          {onRegenerate && (
            <button onClick={onRegenerate} className="action-btn regenerate-btn">
              <span>🔄</span> Regenerate
            </button>
          )}
          <button
            className="action-btn copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(imageUrl);
              alert('Image URL copied!');
            }}
          >
            <span>🔗</span> Copy URL
          </button>
        </div>

        <style jsx>{`
          .result-section {
            animation: slideUp 0.6s ease-out;
            text-align: center;
            max-width: 600px;
            margin: 40px auto 0;
          }

          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) translateZ(0);
            }
            to { 
              opacity: 1;
              transform: translateY(0) translateZ(0);
            }
          }

          .result-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 24px;
            color: var(--text-primary);
            font-weight: 600;
          }

          .generation-time {
            font-size: 14px;
            color: var(--text-secondary);
            font-weight: normal;
          }

          .image-container {
            background: var(--bg-card);
            padding: 40px;
            border-radius: 16px;
            border: 2px solid var(--gold-primary);
            box-shadow: 0 0 20px var(--glow-gold), 0 2px 8px rgba(0, 0, 0, 0.2);
            margin-bottom: 20px;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            backdrop-filter: blur(10px);
            will-change: transform;
          }

          .image-container:hover {
            transform: translateY(-2px) translateZ(0);
            box-shadow: 0 0 30px var(--glow-gold-strong), 0 4px 12px rgba(0, 0, 0, 0.3);
            border-color: var(--gold-light);
          }

          .generated-image {
            max-width: 100%;
            max-height: 500px;
            border-radius: 12px;
          }

          .fade-in-image {
            animation: fadeInScale 0.5s ease-out;
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9) translateZ(0);
            }
            to {
              opacity: 1;
              transform: scale(1) translateZ(0);
            }
          }

          .action-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .action-btn {
            flex: 1;
            min-width: 140px;
            padding: 12px 24px;
            border-radius: 10px;
            border: none;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-height: 48px;
          }

          .download-btn {
            background: linear-gradient(135deg, var(--gold-dark), var(--gold-primary));
            color: white;
            box-shadow: 0 2px 8px var(--glow-gold);
          }

          .download-btn:hover {
            transform: translateY(-1px) translateZ(0);
            box-shadow: 0 4px 12px var(--glow-gold-strong);
          }

          .regenerate-btn {
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(10px);
          }

          .regenerate-btn:hover {
            border-color: var(--gold-primary);
            color: var(--gold-light);
            transform: translateY(-1px) translateZ(0);
            box-shadow: 0 2px 8px var(--glow-gold);
          }

          .copy-btn {
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(10px);
          }

          .copy-btn:hover {
            border-color: var(--gold-primary);
            color: var(--gold-light);
            transform: translateY(-1px) translateZ(0);
            box-shadow: 0 2px 8px var(--glow-gold);
          }

          @media (max-width: 480px) {
            .result-title {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
              font-size: 20px;
            }
            
            .image-container {
              padding: 20px;
              min-height: 300px;
            }
            
            .action-buttons {
              flex-direction: column;
            }
            
            .action-btn {
              width: 100%;
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}
