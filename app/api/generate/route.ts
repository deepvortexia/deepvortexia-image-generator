import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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

    // Create Supabase client
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
    )

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Please sign in to generate images. Create a free account to get started!', success: false },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token. Please sign in again.', success: false },
        { status: 401 }
      )
    }

    // User is authenticated, verify and deduct credits
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

    console.log('📥 Generate request received:', {
      prompt: prompt?.substring(0, 50) + '...',
      aspectRatio: selectedRatio,
      timestamp: new Date().toISOString(),
    });

    console.log('Generating image with Imagen-4-Fast:', {
      promptLength: prompt.length,
      aspectRatio: selectedRatio,
      authenticated: !!user,
    });

    // Call Replicate API with Imagen-4
    let generationFailed = false;
    let userId: string | undefined = user?.id;

    try {
      console.log('🚀 Calling Replicate with Imagen-4-Fast...');
      
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
      );

      // Extract image URL with comprehensive handling
      let imageUrl: string | null = null;
      
      // Case 1: Direct string URL
      if (typeof output === 'string') {
        imageUrl = output;
      }
      // Case 2: URL object
      else if (output instanceof URL) {
        imageUrl = output.toString();
      }
      // Case 3: Array
      else if (Array.isArray(output)) {
        if (output.length === 0) {
          throw new Error('No image generated - empty array');
        }
        const firstItem = output[0];
        
        if (typeof firstItem === 'string') {
          imageUrl = firstItem;
        } else if (firstItem instanceof URL) {
          imageUrl = firstItem.toString();
        } else if (firstItem && typeof firstItem === 'object') {
          // Check for FileOutput with url() method
          if ('url' in firstItem) {
            const urlValue = firstItem.url;
            if (typeof urlValue === 'function') {
              const result = await urlValue();
              imageUrl = typeof result === 'string' ? result : result?.toString?.() || String(result);
            } else if (urlValue instanceof URL) {
              imageUrl = urlValue.toString();
            } else if (typeof urlValue === 'string') {
              imageUrl = urlValue;
            }
          } else if ('href' in firstItem) {
            const hrefValue = (firstItem as any).href;
            imageUrl = typeof hrefValue === 'string' ? hrefValue : hrefValue?.toString?.() || String(hrefValue);
          }
          // Try toString if nothing else worked
          if (!imageUrl && firstItem.toString && firstItem.toString !== Object.prototype.toString) {
            const str = firstItem.toString();
            if (typeof str === 'string' && str.startsWith('http')) {
              imageUrl = str;
            }
          }
        }
      }
      // Case 4: Single object (FileOutput)
      else if (output && typeof output === 'object') {
        // Check for url property/method
        if ('url' in output) {
          const urlValue = (output as any).url;
          if (typeof urlValue === 'function') {
            const result = await urlValue();
            imageUrl = typeof result === 'string' ? result : result?.toString?.() || String(result);
          } else if (urlValue instanceof URL) {
            imageUrl = urlValue.toString();
          } else if (typeof urlValue === 'string') {
            imageUrl = urlValue;
          }
        }
        // Check for href property
        else if ('href' in output) {
          const hrefValue = (output as any).href;
          imageUrl = typeof hrefValue === 'string' ? hrefValue : hrefValue?.toString?.() || String(hrefValue);
        }
        // Try toString
        if (!imageUrl && output.toString && output.toString !== Object.prototype.toString) {
          const str = output.toString();
          if (typeof str === 'string' && str.startsWith('http')) {
            imageUrl = str;
          }
        }
        // Check for async iterator
        if (!imageUrl && (Symbol.asyncIterator in output)) {
          console.log('📦 Output is async iterable, collecting items...');
          const items: any[] = [];
          for await (const item of output as AsyncIterable<any>) {
            items.push(item);
          }
          console.log('📦 Collected items:', items.length);
          if (items.length > 0) {
            const firstItem = items[0];
            if (typeof firstItem === 'string') {
              imageUrl = firstItem;
            } else if (firstItem instanceof URL) {
              imageUrl = firstItem.toString();
            } else if (firstItem?.url) {
              const urlVal = typeof firstItem.url === 'function' ? await firstItem.url() : firstItem.url;
              imageUrl = typeof urlVal === 'string' ? urlVal : urlVal?.toString?.() || String(urlVal);
            }
          }
        }
      }

      // CRITICAL: Ensure imageUrl is a string
      if (imageUrl !== null && typeof imageUrl !== 'string') {
        console.log('⚠️ imageUrl is not a string, converting...', typeof imageUrl);
        imageUrl = String(imageUrl);
      }

      // Final validation
      if (!imageUrl) {
        console.error('❌ Failed to extract image URL');
        console.error('❌ Output was:', output);
        throw new Error('Could not extract image URL from Replicate response');
      }

      // Validate URL format - NOW SAFE because we ensured it's a string
      if (typeof imageUrl !== 'string') {
        throw new Error('Image URL is not a string');
      }
      
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        console.error('❌ Invalid URL format:', imageUrl);
        throw new Error('Invalid image URL format');
      }

      console.log('✅ Image generated successfully:', imageUrl);

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
