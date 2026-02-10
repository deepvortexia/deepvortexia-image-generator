import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

// Server-side validation of valid packs
const VALID_PACKS = {
  'Starter': { credits: 10, price: 349 },   // $3.49
  'Basic': { credits: 30, price: 799 },     // $7.99
  'Popular': { credits: 75, price: 1699 },  // $16.99
  'Pro': { credits: 200, price: 3999 },     // $39.99
  'Ultimate': { credits: 500, price: 8499 }, // $84.99
} as const;

type PackName = keyof typeof VALID_PACKS;

export async function POST(req: NextRequest) {
  try {
    // Check for Stripe secret key
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
    });

    // Parse request body
    const { packName, credits, price } = await req.json();

    // Validate pack name
    if (!packName || !(packName in VALID_PACKS)) {
      return NextResponse.json(
        { error: 'Invalid pack name' },
        { status: 400 }
      );
    }

    // Server-side validation: ensure the pack details match
    const validPack = VALID_PACKS[packName as PackName];
    if (validPack.credits !== credits || validPack.price !== price) {
      console.error('❌ Pack validation failed:', { packName, credits, price, validPack });
      return NextResponse.json(
        { error: 'Invalid pack details' },
        { status: 400 }
      );
    }

    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ Authentication failed:', authError);
      return NextResponse.json(
        { error: 'You must be logged in to purchase credits' },
        { status: 401 }
      );
    }

    console.log('✅ Creating checkout session for user:', user.id, 'Pack:', packName);

    // Get the app URL for success/cancel redirects
    const appUrl = process.env.NEXT_PUBLIC_HUB_URL || req.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packName} Pack - ${credits} Credits`,
              description: `Purchase ${credits} credits for generating AI images`,
              images: [`${appUrl}/deepgoldremoveetiny.png`],
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}`,
      metadata: {
        packName,
        credits: credits.toString(),
        userId: user.id,
      },
    });

    console.log('✅ Checkout session created:', session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
