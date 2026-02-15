import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const VALID_PACKS = {
  'Starter': { credits: 10, price: 349 },
  'Basic': { credits: 30, price: 799 },
  'Popular': { credits: 75, price: 1699 },
  'Pro': { credits: 200, price: 3999 },
  'Ultimate': { credits: 500, price: 8499 },
} as const;

type PackName = keyof typeof VALID_PACKS;

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    // Utilisation de la version stable validée par Vercel
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    const { packName, credits, price } = await req.json();

    if (!packName || !(packName in VALID_PACKS)) {
      return NextResponse.json({ error: 'Invalid pack name' }, { status: 400 });
    }

    // --- CORRECTION ICI : Ajout du await indispensable ---
    const supabase = await createClient(); 
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to purchase credits.' },
        { status: 401 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_HUB_URL || req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packName} Pack - ${credits} Credits`,
              description: `Purchase ${credits} credits for generating AI images`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}?canceled=true`,
      metadata: {
        packName,
        credits: credits.toString(),
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
