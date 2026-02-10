import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Disable body parsing - critical for Stripe signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook received');
  
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔍 Environment check:', {
      hasStripeKey: !!stripeSecretKey,
      hasWebhookSecret: !!webhookSecret,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceRoleKey: !!supabaseServiceRoleKey,
      webhookSecretPrefix: webhookSecret?.substring(0, 10) + '...',
    });

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceRoleKey) {
      console.error('❌ Missing environment variables');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey);

    // CRITICAL: Read raw body FIRST before anything else
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    console.log('📝 Request details:', {
      hasBody: !!rawBody,
      bodyLength: rawBody?.length,
      hasSignature: !!signature,
      signaturePrefix: signature?.substring(0, 30) + '...',
    });

    if (!signature) {
      console.error('❌ No Stripe signature in headers');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      console.log('✅ Webhook signature verified successfully:', event.type);
    } catch (err) {
      const error = err as Error;
      console.error('❌ Signature verification failed:', {
        message: error.message,
        webhookSecretUsed: webhookSecret?.substring(0, 15) + '...',
      });
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💰 Processing checkout session:', session.id);

      const { packName, credits, userId } = session.metadata || {};
      
      console.log('📦 Metadata:', { packName, credits, userId });

      if (!packName || !credits || !userId) {
        console.error('❌ Missing metadata');
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      const creditsNumber = parseInt(credits, 10);

      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Get current credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError);
        return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
      }

      const currentCredits = profile?.credits || 0;
      const newCredits = currentCredits + creditsNumber;

      console.log('💳 Credits update:', { currentCredits, adding: creditsNumber, newCredits });

      // Update credits
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: newCredits, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Credits update error:', updateError);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
      }

      console.log('✅ Credits updated successfully!', { userId, newCredits });

      // Create transaction record (optional, don't fail if it errors)
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        pack_name: packName,
        amount_cents: session.amount_total || 0,
        credits_purchased: creditsNumber,
        status: 'completed',
      });

      if (txError) {
        console.warn('⚠️ Transaction record failed (non-critical):', txError);
      }

      return NextResponse.json({ received: true, creditsAdded: creditsNumber });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
