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
      <div className="mt-8 flex flex-col items-center justify-center py-12 bg-gray-900 border border-gray-700 rounded-lg">
        <svg className="animate-spin h-12 w-12 text-yellow-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-300 text-lg">Generating your image...</p>
        <p className="text-gray-500 text-sm mt-2">This usually takes 2-5 seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-900/20 border border-red-500/50 rounded-lg">
        <div className="flex items-center gap-2 text-red-400">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="mt-8">
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-4">
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
            className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
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
