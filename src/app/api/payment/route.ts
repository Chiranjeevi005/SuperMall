import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';
import paymentService from '@/services/paymentService';
import { cartMiddleware } from '@/middleware/cartMiddleware';

// POST /api/payment/create - Create a payment intent
export async function POST(request: NextRequest) {
  try {
    // Apply middleware
    const middlewareResponse = await cartMiddleware(request);
    if (middlewareResponse) return middlewareResponse;
    
    await dbConnect();
    
    const userId = (request as any).user?.id;
    const body = await request.json();
    const { amount, currency = 'INR', orderId } = body;
    
    // Validate input
    if (!amount) {
      return errorHandlers.apiErrorResponse('Amount is required', 400);
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      return errorHandlers.apiErrorResponse('Invalid amount', 400);
    }
    
    if (typeof currency !== 'string' || currency.length === 0) {
      return errorHandlers.apiErrorResponse('Invalid currency', 400);
    }
    
    // Create payment intent
    const paymentIntent = await paymentService.createPaymentIntent(amount, currency);
    
    logger.info('Payment intent created', { userId, amount, currency, paymentIntentId: paymentIntent.id });
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Error creating payment intent', error);
    return errorHandlers.apiErrorResponse('Failed to create payment intent');
  }
}

// PUT /api/payment/confirm - Confirm a payment
export async function PUT(request: NextRequest) {
  try {
    // Apply middleware
    const middlewareResponse = await cartMiddleware(request);
    if (middlewareResponse) return middlewareResponse;
    
    await dbConnect();
    
    const userId = (request as any).user?.id;
    const body = await request.json();
    const { paymentMethod, amount, paymentData, orderId } = body;
    
    // Validate input
    if (!paymentMethod || !amount) {
      return errorHandlers.apiErrorResponse('Payment method and amount are required', 400);
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      return errorHandlers.apiErrorResponse('Invalid amount', 400);
    }
    
    if (typeof paymentMethod !== 'string' || paymentMethod.length === 0) {
      return errorHandlers.apiErrorResponse('Invalid payment method', 400);
    }
    
    // Process payment
    const paymentResult = await paymentService.processPayment(paymentMethod, amount, paymentData, orderId);
    
    if (paymentResult.success) {
      // Update order status if orderId was provided
      if (orderId) {
        await Order.findOneAndUpdate(
          { orderId: orderId },
          {
            paymentStatus: 'completed',
            status: 'processing'
          }
        );
      }
      
      logger.info('Payment processed successfully', { 
        userId, 
        paymentMethod, 
        amount, 
        orderId: paymentResult.orderId 
      });
      
      return NextResponse.json({
        success: true,
        orderId: paymentResult.orderId,
        redirectUrl: paymentResult.redirectUrl
      });
    } else {
      // Update order status to failed if orderId was provided
      if (orderId) {
        await Order.findOneAndUpdate(
          { orderId: orderId },
          {
            paymentStatus: 'failed'
          }
        );
      }
      
      logger.warn('Payment processing failed', { 
        userId, 
        paymentMethod, 
        amount, 
        error: paymentResult.errorMessage 
      });
      
      return NextResponse.json({
        success: false,
        error: paymentResult.errorMessage
      }, { status: 400 });
    }
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Error processing payment', error);
    return errorHandlers.apiErrorResponse('Failed to process payment');
  }
}