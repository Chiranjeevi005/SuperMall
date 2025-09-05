import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import logger from '@/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'inr', orderId } = await request.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Validate orderId
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Connect to database
    const connection = await dbConnect();
    
    // Verify the order exists
    if (connection.connection?.readyState === 1) {
      const order = await Order.findOne({ orderId: orderId });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in smallest currency unit (paise for INR)
      currency: currency,
      metadata: {
        orderId: orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Try to update the order with the payment intent ID
    try {
      const connection = await dbConnect();
      // Only update if we have a real database connection
      if (connection.connection?.readyState === 1) {
        await Order.findOneAndUpdate(
          { orderId: orderId },
          { paymentIntentId: paymentIntent.id }
        );
        logger.info('Order updated with payment intent ID', { orderId, paymentIntentId: paymentIntent.id });
      }
    } catch (dbError) {
      console.warn('Failed to update order with payment intent ID (continuing anyway):', dbError);
    }

    logger.info('Payment intent created', { paymentIntentId: paymentIntent.id, orderId });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId
    });
  } catch (error: any) {
    logger.error('Error creating payment intent', { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}