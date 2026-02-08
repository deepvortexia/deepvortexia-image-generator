import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { 
          error: 'Prompt is required and must be a non-empty string',
          success: false 
        },
        { status: 400 }
      );
    }

    // Validate aspect ratio
    const validAspectRatios = ['1:1', '4:3', '16:9', '9:16'];
    const selectedRatio = aspectRatio && validAspectRatios.includes(aspectRatio) 
      ? aspectRatio 
      : '1:1';

    console.log('Generating image with Imagen-4-Fast:', {
      promptLength: prompt.length,
      aspectRatio: selectedRatio,
    });

    // Call Replicate API with CORRECT Imagen-4 parameters
    const output = await replicate.run(
      "google/imagen-4-fast",
      {
        input: {
          prompt: prompt.trim(),
          aspect_ratio: selectedRatio,
          output_format: 'jpg',
          safety_tolerance: 2,
        }
      }
    ) as string | string[];

    // Handle output format (can be string or array)
    let imageUrl: string;
    
    if (Array.isArray(output)) {
      if (output.length === 0) {
        throw new Error('No image generated');
      }
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else {
      throw new Error('Unexpected output format from Replicate');
    }

    console.log('Image generated successfully:', imageUrl);

    // Return success response
    return NextResponse.json({ 
      imageUrl,
      success: true 
    });
    
  } catch (error: any) {
    console.error('❌ Imagen generation error:', {
      message: error.message,
      status: error.response?.status,
      details: error.response?.data,
    });

    // Check for specific error types
    if (error.message?.includes('REPLICATE_API_TOKEN')) {
      return NextResponse.json(
        { 
          error: 'Server configuration error: Missing API token',
          success: false 
        },
        { status: 500 }
      );
    }

    if (error.response?.status === 402) {
      return NextResponse.json(
        { 
          error: 'Insufficient Replicate credits. Please add credits to your Replicate account.',
          success: false 
        },
        { status: 402 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again in a moment.',
          success: false 
        },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Failed to generate image. Please try again.',
        details: error.message,
        success: false 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
