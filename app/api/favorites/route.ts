import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

interface AuthResult {
  success: boolean;
  user?: { id: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase?: any;
  error?: NextResponse;
}

async function authenticateRequest(req: NextRequest): Promise<AuthResult> {
  // Create two Supabase clients:
  // 1. Auth client with anon key for JWT verification (getUser)
  // 2. Admin client with service role key for database queries (bypass RLS)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Server configuration error: Supabase credentials not configured', success: false },
        { status: 500 }
      )
    };
  }

  // Use anon key for auth verification
  const supabaseAuth = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  // Use service role key for database operations (bypasses RLS)
  const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

  // Get token from Authorization header
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      )
    };
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)

  if (authError || !user) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid authentication token', success: false },
        { status: 401 }
      )
    };
  }

  return {
    success: true,
    user,
    supabase
  };
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.success) {
      return authResult.error!;
    }

    const { user, supabase } = authResult;

    // Fetch favorites for the authenticated user
    const { data, error } = await supabase!
      .from('images')
      .select('*')
      .eq('user_id', user!.id)
      .eq('is_favorite', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json(
        { error: 'Failed to fetch favorites', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      favorites: data || [],
      success: true 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/favorites:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: 'imageId is required', success: false },
        { status: 400 }
      );
    }

    const authResult = await authenticateRequest(req);
    if (!authResult.success) {
      return authResult.error!;
    }

    const { user, supabase } = authResult;

    // Get current state of the image
    const { data: image, error: fetchError } = await supabase!
      .from('images')
      .select('is_favorite')
      .eq('id', imageId)
      .eq('user_id', user!.id)
      .single();

    if (fetchError || !image) {
      console.error('Error fetching image:', fetchError);
      return NextResponse.json(
        { error: 'Image not found or access denied', success: false },
        { status: 404 }
      );
    }

    // Toggle the favorite status
    const newFavoriteStatus = !image.is_favorite;
    const { error: updateError } = await supabase!
      .from('images')
      .update({ is_favorite: newFavoriteStatus })
      .eq('id', imageId)
      .eq('user_id', user!.id);

    if (updateError) {
      console.error('Error updating favorite status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update favorite status', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      isFavorite: newFavoriteStatus,
      success: true 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in POST /api/favorites:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
