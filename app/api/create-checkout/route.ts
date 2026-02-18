import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Map pack names to real Stripe Price IDs (USD)
const STRIPE_PRICE_IDS: Record<string, { priceId: string; credits: number }> = {
  'Starter':  { priceId: 'price_1T2JElPRCOojlkAvUxkIsMaT', credits: 10 },
  'Basic':    { priceId: 'price_1T2JGJPRCOojlkAvSIuNcbrz', credits: 30 },
  'Popular':  { priceId: 'price_1T2JHDPRCOojlkAvePY8B1Oa', credits: 75 },
  'Pro':      { priceId: 'price_1T2JIvPRCOojlkAvGTd0AEWj', credits: 200 },
  'Ultimate': { priceId: 'price_1T2JKiPRCOojlkAvIOnW4Qkl', credits: 500 },
};

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    const { packName } = await req.json();

    if (!packName || !(packName in STRIPE_PRICE_IDS)) {
      return NextResponse.json({ error: 'Invalid pack name' }, { status: 400 });
    }

    const pack = STRIPE_PRICE_IDS[packName];

    // Auth: verify JWT from Authorization header
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAuth = createSupabaseClient(supabaseUrl, supabaseAnonKey);
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'You must be logged in to purchase credits.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be logged in to purchase credits.' }, { status: 401 });
    }

    // IMPORTANT: success_url and cancel_url must point to the IMAGE GENERATOR app
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://images.deepvortexai.art';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: pack.priceId,  // Use the real Stripe Price ID
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}?canceled=true`,
      metadata: {
        packName,
        credits: pack.credits.toString(),
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
