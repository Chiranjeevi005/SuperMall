import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '../../../../lib/stripe';
import { connectToDataBase } from '../../../../../dataBase/dbConfig';
import OrderModel from '../../../../../models/order';
import { UserModels } from '../../../../../models/user';

export async function POST(request: NextRequest) {
  try {
    await connectToDataBase();

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Webhook configuration error' },
        { status: 500 }
      );
    }

    // Construct and verify webhook event
    const eventResult = constructWebhookEvent(body, signature, webhookSecret);
    if (!eventResult.success) {
      console.error('Webhook verification failed:', eventResult.error);
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      );
    }

    const event = eventResult.event!;
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as any);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as any);
        break;
        
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as any);
        break;
        
      case 'payment_intent.processing':
        await handlePaymentProcessing(event.data.object as any);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    const order = await OrderModel.findOne({ 
      paymentIntentId: paymentIntent.id 
    }).populate('user');

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order status
    await OrderModel.findByIdAndUpdate(order._id, {
      paymentStatus: 'paid',
      status: 'confirmed',
      paidAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Payment succeeded for order: ${order.orderNumber}`);
    
    // Here you could add additional logic like:
    // - Send confirmation email
    // - Update inventory
    // - Notify vendors
    // - Create shipping labels

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    const order = await OrderModel.findOne({ 
      paymentIntentId: paymentIntent.id 
    });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order status
    await OrderModel.findByIdAndUpdate(order._id, {
      paymentStatus: 'failed',
      status: 'cancelled',
      updatedAt: new Date(),
    });

    console.log(`Payment failed for order: ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  try {
    const order = await OrderModel.findOne({ 
      paymentIntentId: paymentIntent.id 
    });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order status
    await OrderModel.findByIdAndUpdate(order._id, {
      paymentStatus: 'cancelled',
      status: 'cancelled',
      updatedAt: new Date(),
    });

    console.log(`Payment canceled for order: ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling payment canceled:', error);
  }
}

async function handlePaymentProcessing(paymentIntent: any) {
  try {
    const order = await OrderModel.findOne({ 
      paymentIntentId: paymentIntent.id 
    });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order status
    await OrderModel.findByIdAndUpdate(order._id, {
      paymentStatus: 'processing',
      updatedAt: new Date(),
    });

    console.log(`Payment processing for order: ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling payment processing:', error);
  }
}