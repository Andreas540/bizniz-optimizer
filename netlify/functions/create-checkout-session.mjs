import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { modules, totalMonthly } = body;

    // Build line items from selected modules
    const lineItems = modules.map((mod) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${mod.name} (${mod.users} user${mod.users > 1 ? 's' : ''})`,
          description: `Bizniz Optimizer — ${mod.name} module`,
        },
        unit_amount: Math.round(mod.cost * 100), // Stripe uses cents
        recurring: {
          interval: 'month',
        },
      },
      quantity: 1,
    }));

    const origin = req.headers.get('origin') || 'https://biznizoptimizer.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      allow_promotion_codes: true,
      line_items: lineItems,
      success_url: `${origin}/order-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=true`,
      metadata: {
        modules: JSON.stringify(modules),
        totalMonthly: totalMonthly.toString(),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Stripe error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}