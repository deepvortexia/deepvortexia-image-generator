import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Check if user is authenticated (optional for this app)
    const supabase = await createClient();
    let user: any = null;
    
    // If Supabase is not configured, just allow generation (free tier only)
    if (supabase) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      user = authUser;

      // If user is logged in, verify and deduct credits
      if (user) {
        try {
          // Get user's profile with credits
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single();

          if (profileError) {
            return NextResponse.json(
              { 
                error: 'Failed to fetch user profile',
                success: false 
              },
              { status: 500 }
            );
          }

          // Check if user has enough credits
          if (!profile || profile.credits < 1) {
            return NextResponse.json(
              { 
                error: 'Insufficient credits. Please purchase more credits to continue.',
                success: false 
              },
              { status: 402 }
            );
          }

          // Deduct credit before generation using atomic operation
          // This prevents race conditions by ensuring credits don't go below 0
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
              credits: profile.credits - 1,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .eq('credits', profile.credits) // Only update if credits haven't changed (optimistic locking)
            .select()
            .single();

          if (updateError || !updatedProfile) {
            // If update failed, it means credits were changed by another request
            return NextResponse.json(
              { 
                error: 'Credit check failed, please try again',
                success: false 
              },
              { status: 409 }
            );
          }

          console.log('✅ Credit deducted. Remaining:', updatedProfile.credits);
        } catch (error: unknown) {
          console.error('Error deducting credit:', error);
          return NextResponse.json(
            { 
              error: 'Failed to deduct credit',
              success: false 
            },
            { status: 500 }
          );
        }
      }
    } else {
      console.log('⚠️ Supabase not configured, allowing free generation');
    }
    // For non-logged users, free generations are tracked client-side
    // No server-side validation needed

    console.log('Generating image with Imagen-4-Fast:', {
      promptLength: prompt.length,
      aspectRatio: selectedRatio,
      authenticated: !!user,
    });

    // Call Replicate API with CORRECT Imagen-4 parameters
    let generationFailed = false;
    let userId: string | undefined = user?.id;

    try {
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
          generationFailed = true;
          throw new Error('No image generated');
        }
        imageUrl = output[0];
      } else if (typeof output === 'string') {
        imageUrl = output;
      } else {
        generationFailed = true;
        throw new Error('Unexpected output format from Replicate');
      }

      console.log('Image generated successfully:', imageUrl);

      // Return success response
      return NextResponse.json({ 
        imageUrl,
        success: true 
      });
    } catch (generationError: unknown) {
      generationFailed = true;
      
      // If generation failed and user was logged in, restore the credit
      if (userId) {
        try {
          const { data: currentProfile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

          if (currentProfile) {
            await supabase
              .from('profiles')
              .update({
                credits: currentProfile.credits + 1,
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId);
            
            console.log('✅ Credit restored due to generation failure');
          }
        } catch (restoreError) {
          console.error('❌ Failed to restore credit:', restoreError);
        }
      }
      
      throw generationError; // Re-throw to be caught by outer catch
    }
     
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = (error as any).response;
    
    console.error('❌ Imagen generation error:', {
      message: errorMessage,
      status: errorResponse?.status,
      details: errorResponse?.data,
    });

    // Check for specific error types
    if (errorMessage?.includes('REPLICATE_API_TOKEN')) {
      return NextResponse.json(
        { 
          error: 'Server configuration error: Missing API token',
          success: false 
        },
        { status: 500 }
      );
    }

    if (errorResponse?.status === 402) {
      return NextResponse.json(
        { 
          error: 'Insufficient Replicate credits. Please add credits to your Replicate account.',
          success: false 
        },
        { status: 402 }
      );
    }

    if (errorResponse?.status === 429) {
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
        details: errorMessage,
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
