import Stripe from 'stripe';

function isDemoMode(): boolean {
  return !process.env.STRIPE_SECRET_KEY ||
         process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder' ||
         process.env.STRIPE_SECRET_KEY.includes('placeholder');
}

// Lazy initialization to avoid errors at build time
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (isDemoMode()) {
      throw new Error('Stripe is not configured in demo mode');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

// For backward compatibility - will throw in demo mode if accessed
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe];
  }
});

export async function createCheckoutSession(
  orderId: string,
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      orderId,
    },
  });

  return session;
}

export async function createPaymentIntent(
  amount: number,
  currency: string = 'eur',
  orderId: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata: {
      orderId,
    },
  });

  return paymentIntent;
}

export function constructWebhookEvent(
  payload: Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
