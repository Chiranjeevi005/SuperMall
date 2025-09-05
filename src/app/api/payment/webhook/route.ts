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
    // Get the raw body and headers
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') as string;
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      logger.error('Webhook signature verification failed', { error: err.message });
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        logger.info('Payment succeeded', { paymentIntentId: paymentIntentSucceeded.id });
        
        try {
          // Try to update order status in database
          const connection = await dbConnect();
          if (connection.connection?.readyState === 1) {
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
          console.warn('Failed to update order status (continuing anyway):', dbError);
        }
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        logger.info('Payment failed', { paymentIntentId: paymentIntentFailed.id });
        
        try {
          // Try to update order status in database
          const connection = await dbConnect();
          if (connection.connection?.readyState === 1) {
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
          console.warn('Failed to update order status (continuing anyway):', dbError);
        }
        break;
        
      case 'payment_intent.canceled':
        const paymentIntentCanceled = event.data.object as Stripe.PaymentIntent;
        logger.info('Payment canceled', { paymentIntentId: paymentIntentCanceled.id });
        
        try {
          // Try to update order status in database
          const connection = await dbConnect();
          if (connection.connection?.readyState === 1) {
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
          console.warn('Failed to update order status (continuing anyway):', dbError);
        }
        break;
        
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    logger.error('Error processing webhook', { error: error.message });
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}