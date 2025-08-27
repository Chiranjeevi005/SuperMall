import Stripe from 'stripe';

let stripe: Stripe | null = null;
let stripeInitializationError: string | null = null;

try {
  console.log('Initializing Stripe with key:', process.env.STRIPE_SECRET_KEY ? 'Key present' : 'Key missing');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }

  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', 
    typescript: true,
  });
  
  console.log('Stripe initialized successfully');
} catch (error) {
  stripeInitializationError = error instanceof Error ? error.message : 'Failed to initialize Stripe';
  console.error('Stripe initialization error:', stripeInitializationError);
}

export { stripe };

// Utils to check initialization
const checkStripe = () => {
  if (!stripe) {
    const errorMsg = stripeInitializationError || 'Stripe not initialized';
    console.error('Stripe check failed:', errorMsg);
    return { success: false, error: errorMsg };
  }
  return null;
};

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'inr',
  metadata: Record<string, string> = {}
) => {
  const initError = checkStripe();
  if (initError) return initError;

  try {
    console.log('Creating payment intent:', { amount, currency, metadata });
    const paymentIntent = await stripe!.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    console.log('Payment intent created successfully:', paymentIntent.id);
    return { success: true, paymentIntent, clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Payment processing failed' };
  }
};

export const confirmPaymentIntent = async (paymentIntentId: string) => {
  const initError = checkStripe();
  if (initError) return initError;

  try {
    console.log('Confirming payment intent:', paymentIntentId);
    const paymentIntent = await stripe!.paymentIntents.retrieve(paymentIntentId);
    console.log('Payment intent confirmed:', paymentIntent.status);
    return { success: true, paymentIntent, status: paymentIntent.status };
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Payment confirmation failed' };
  }
};

export const createCustomer = async (email: string, name: string, metadata: Record<string, string> = {}) => {
  const initError = checkStripe();
  if (initError) return initError;

  try {
    console.log('Creating customer:', { email, name, metadata });
    const customer = await stripe!.customers.create({ email, name, metadata });
    console.log('Customer created successfully:', customer.id);
    return { success: true, customer };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Customer creation failed' };
  }
};

export const createRefund = async (
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) => {
  const initError = checkStripe();
  if (initError) return initError;

  try {
    console.log('Creating refund:', { paymentIntentId, amount, reason });
    const refund = await stripe!.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason,
    });
    console.log('Refund created successfully:', refund.id);
    return { success: true, refund };
  } catch (error) {
    console.error('Error creating refund:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Refund processing failed' };
  }
};

export const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) => {
  const initError = checkStripe();
  if (initError) return initError;

  try {
    console.log('Constructing webhook event');
    const event = stripe!.webhooks.constructEvent(payload, signature, webhookSecret);
    console.log('Webhook event constructed successfully');
    return { success: true, event };
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Webhook verification failed' };
  }
};

// Currency utils
export const formatCurrency = (amount: number, currency: string = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);

export const convertToStripeAmount = (amount: number) => Math.round(amount * 100);
export const convertFromStripeAmount = (amount: number) => amount / 100;