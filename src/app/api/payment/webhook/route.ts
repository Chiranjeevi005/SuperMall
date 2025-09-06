import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import logger from '@/utils/logger';

// Initialize Stripe only when needed, not during module import
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  // During build time, return a mock object
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {
      webhooks: {
        constructEvent: () => ({
          type: 'payment_intent.succeeded',
          data: {
            object: {
              id: 'mock_payment_intent_id',
            },
          },
        }),
      },
    } as any;
  }

  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }
  return stripe;
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body and headers
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') as string;
    
    // Validate required environment variables
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      logger.error('STRIPE_WEBHOOK_SECRET environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      logger.error('Webhook signature verification failed', { error: err.message });
      // Don't expose internal error details to users
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        logger.info('Payment succeeded', { paymentIntentId: paymentIntentSucceeded.id });
        
        try {
          // Try to update order status in database
          const connection = await dbConnect();
          
          // Validate database connection
          if (!connection || !connection.connection) {
            logger.error('Database connection failed in webhook handler for payment_intent.succeeded');
            break;
          }
          
          if (connection.connection.readyState === 1) {
            const updatedOrder = await Order.findOneAndUpdate(
              { paymentIntentId: paymentIntentSucceeded.id },
              { 
                paymentStatus: 'completed',
                status: 'processing' // Changed from 'confirmed' to 'processing' to match the order model
              },
              { new: true }
            );
            
            if (updatedOrder) {
              logger.info('Order updated successfully', { orderId: updatedOrder.orderId });
            } else {
              logger.warn('Order not found for payment intent', { paymentIntentId: paymentIntentSucceeded.id });
            }
          }
        } catch (dbError) {
          logger.error('Failed to update order status in webhook handler for payment_intent.succeeded', { error: dbError });
        }
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        logger.info('Payment failed', { paymentIntentId: paymentIntentFailed.id });
        
        try {
          // Try to update order status in database
          const connection = await dbConnect();
          
          // Validate database connection
          if (!connection || !connection.connection) {
            logger.error('Database connection failed in webhook handler for payment_intent.payment_failed');
            break;
          }
          
          if (connection.connection.readyState === 1) {
            const failedOrder = await Order.findOneAndUpdate(
              { paymentIntentId: paymentIntentFailed.id },
              { 
                paymentStatus: 'failed',
                status: 'cancelled'
              },
              { new: true }
            );
            
            if (failedOrder) {
              logger.info('Order updated successfully', { orderId: failedOrder.orderId });
            } else {
              logger.warn('Order not found for payment intent', { paymentIntentId: paymentIntentFailed.id });
            }
          }
        } catch (dbError) {
          logger.error('Failed to update order status in webhook handler for payment_intent.payment_failed', { error: dbError });
        }
        break;
        
      case 'payment_intent.canceled':
        const paymentIntentCanceled = event.data.object as Stripe.PaymentIntent;
        logger.info('Payment canceled', { paymentIntentId: paymentIntentCanceled.id });
        
        try {
          // Try to update order status in database
          const connection = await dbConnect();
          
          // Validate database connection
          if (!connection || !connection.connection) {
            logger.error('Database connection failed in webhook handler for payment_intent.canceled');
            break;
          }
          
          if (connection.connection.readyState === 1) {
            const canceledOrder = await Order.findOneAndUpdate(
              { paymentIntentId: paymentIntentCanceled.id },
              { 
                paymentStatus: 'failed',
                status: 'cancelled'
              },
              { new: true }
            );
            
            if (canceledOrder) {
              logger.info('Order updated successfully', { orderId: canceledOrder.orderId });
            } else {
              logger.warn('Order not found for payment intent', { paymentIntentId: paymentIntentCanceled.id });
            }
          }
        } catch (dbError) {
          logger.error('Failed to update order status in webhook handler for payment_intent.canceled', { error: dbError });
        }
        break;
        
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    logger.error('Error processing webhook', { error: error.message });
    // Don't expose internal error details to users
    return NextResponse.json({ received: true }, { status: 200 });
  }
}