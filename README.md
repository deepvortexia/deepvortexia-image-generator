# AI Image Generator 🎨

AI-powered image generation tool using Replicate's `google/imagen-4-fast` model.

## Features

- ✨ Generate stunning images from text descriptions
- 🎯 Multiple aspect ratio options (1:1, 4:3, 16:9, 9:16)
- 🎨 Popular style suggestions
- 💡 Quick idea templates
- ⬇️ Download generated images
- 🌟 Clean, modern UI matching Deep Vortex AI design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Replicate Imagen-4-Fast
- **API**: Replicate SDK

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Replicate API token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/deepvortexia/deepvortexia-image-generator.git
cd deepvortexia-image-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
NEXT_PUBLIC_HUB_URL=https://deepvortexai.art
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a description of the image you want to create
2. Select an aspect ratio (default: 1:1)
3. Optionally, add style suggestions or use quick ideas
4. Click "Generate Image"
5. Download your generated image

## API

The application uses Replicate's Imagen-4-Fast model:
- **Model**: `google/imagen-4-fast`
- **Cost**: $0.02 per image
- **Speed**: 2-3 seconds per generation

## Deployment

This project is designed to be deployed on Vercel:

```bash
npm run build
```

### Environment Variables

Required for deployment:
- `REPLICATE_API_TOKEN`: Your Replicate API token
- `NEXT_PUBLIC_HUB_URL`: URL to Deep Vortex AI hub

## License

MIT

## Credits

Built with ❤️ by [Deep Vortex AI](https://deepvortexai.art)
