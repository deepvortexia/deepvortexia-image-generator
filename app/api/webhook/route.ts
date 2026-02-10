import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// CRITICAL: These exports are required for proper webhook handling
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// This is the KEY fix - disable body parsing completely
export const preferredRegion = 'auto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(request: Request) {
  console.log('🔔 Webhook received at:', new Date().toISOString());

  try {
    // Environment variable check
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔍 Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!webhookSecret,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceRoleKey: !!supabaseServiceRoleKey,
    });

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('❌ Supabase configuration missing');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Get signature from headers
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      console.error('❌ No stripe-signature header found');
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // CRITICAL: Read the raw body as text - must be done before any other body reading
    const rawBody = await request.text();
    
    console.log('📝 Request info:', {
      bodyLength: rawBody.length,
      signatureStart: signature.substring(0, 20) + '...',
    });

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      console.log('✅ Signature verified! Event type:', event.type);
    } catch (err) {
      const error = err as Error;
      console.error('❌ Webhook signature verification failed:', error.message);
      // Log more details for debugging
      console.error('Debug info:', {
        signatureHeader: signature.substring(0, 50),
        bodyPreview: rawBody.substring(0, 100),
        webhookSecretStart: webhookSecret.substring(0, 12) + '...',
      });
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('💰 Processing payment:', {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
      });

      const userId = session.metadata?.userId;
      const credits = session.metadata?.credits;
      const packName = session.metadata?.packName;

      if (!userId || !credits) {
        console.error('❌ Missing required metadata:', { userId, credits, packName });
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      const creditsToAdd = parseInt(credits, 10);
      if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
        console.error('❌ Invalid credits value:', credits);
        return NextResponse.json({ error: 'Invalid credits' }, { status: 400 });
      }

      // Initialize Supabase with service role key
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // Get current user credits
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching profile:', fetchError);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const currentCredits = profile?.credits || 0;
      const newCredits = currentCredits + creditsToAdd;

      console.log('💳 Updating credits:', {
        userId,
        currentCredits,
        adding: creditsToAdd,
        newTotal: newCredits,
      });

      // Update user credits
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          credits: newCredits,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error updating credits:', updateError);
        return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
      }

      console.log('✅ Credits updated successfully!', {
        userId,
        previousCredits: currentCredits,
        addedCredits: creditsToAdd,
        newTotal: newCredits,
      });

      // Record transaction (non-critical)
      try {
        if (!packName) {
          console.warn('⚠️ packName missing in metadata - will record as "MISSING_PACK_NAME"');
        }
        await supabase.from('transactions').insert({
          user_id: userId,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          pack_name: packName || 'MISSING_PACK_NAME',
          amount_cents: session.amount_total || 0,
          credits_purchased: creditsToAdd,
          status: 'completed',
        });
        console.log('📝 Transaction recorded');
      } catch (txError) {
        console.warn('⚠️ Could not record transaction (non-critical):', txError);
      }

      return NextResponse.json({
        received: true,
        creditsAdded: creditsToAdd,
        newTotal: newCredits,
      });
    }

    // For other event types, just acknowledge receipt
    console.log('ℹ️ Unhandled event type:', event.type);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Unexpected webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Explicitly handle other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
