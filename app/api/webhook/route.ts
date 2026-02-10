import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // Check for required environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('❌ Supabase not configured for webhook');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
    });

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('💰 Processing completed checkout session:', session.id);

      // Extract metadata
      const { packName, credits, userId } = session.metadata || {};

      if (!packName || !credits || !userId) {
        console.error('❌ Missing metadata in session:', session.id);
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      const creditsNumber = parseInt(credits, 10);
      const amountCents = session.amount_total || 0;

      // Create Supabase client with service role key for admin access
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      try {
        // 1. Add credits to user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('❌ Error fetching profile:', profileError);
          throw profileError;
        }

        const newCredits = (profile?.credits || 0) + creditsNumber;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ credits: newCredits, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (updateError) {
          console.error('❌ Error updating credits:', updateError);
          throw updateError;
        }

        console.log(`✅ Added ${creditsNumber} credits to user ${userId}. New balance: ${newCredits}`);

        // 2. Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent as string,
            pack_name: packName,
            amount_cents: amountCents,
            credits_purchased: creditsNumber,
            status: 'completed',
          });

        if (transactionError) {
          console.error('❌ Error creating transaction:', transactionError);
          // Don't throw here - credits already added, transaction is just for record keeping
        } else {
          console.log('✅ Transaction record created');
        }

        return NextResponse.json({ received: true, creditsAdded: creditsNumber });
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        );
      }
    }

    // Return success for other event types
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
