import { NextRequest, NextResponse } from 'next/server';
import { confirmPaymentIntent } from '../../../../lib/stripe';
import { connectToDataBase } from '../../../../../dataBase/dbConfig';
import { getTokenFromRequest, verifyToken } from '../../../../lib/auth';
import OrderModel from '../../../../../models/order';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse, validationErrorResponse } from '../../../../lib/api-response';

export async function POST(request: NextRequest) {
  try {
    await connectToDataBase();

    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);

    const body = await request.json();
    const { paymentIntentId } = body;

    // Validate required fields
    if (!paymentIntentId) {
      return validationErrorResponse(['Payment intent ID is required']);
    }

    // Confirm payment with Stripe
    const confirmResult = await confirmPaymentIntent(paymentIntentId);
    if (!confirmResult.success) {
      return errorResponse((confirmResult as { success: false; error: string }).error || 'Payment confirmation failed', 400);
    }

    const paymentIntent = (confirmResult as { success: true; paymentIntent: any }).paymentIntent!;

    // Find the order
    const order = await OrderModel.findOne({ paymentIntentId }).populate('user');
    if (!order) {
      return notFoundResponse('Order not found');
    }

    // Verify order belongs to authenticated user
    if (order.user._id.toString() !== decoded.id) {
      return forbiddenResponse('Unauthorized access to order');
    }

    // Update order status based on payment status
    let orderUpdate: any = {
      paymentStatus: 'failed',
      updatedAt: new Date(),
    };

    if (paymentIntent.status === 'succeeded') {
      orderUpdate = {
        paymentStatus: 'paid',
        status: 'confirmed',
        paidAt: new Date(),
        updatedAt: new Date(),
      };
    } else if (paymentIntent.status === 'processing') {
      orderUpdate.paymentStatus = 'processing';
    } else if (paymentIntent.status === 'requires_payment_method') {
      orderUpdate.paymentStatus = 'failed';
    }

    // Update the order
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      order._id,
      orderUpdate,
      { new: true }
    ).populate(['user', 'items.product']);

    return successResponse({
      paymentStatus: paymentIntent.status,
      order: {
        id: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        total: updatedOrder.pricing?.total || 0,
        paidAt: updatedOrder.paidAt,
      },
      redirectUrl: `/order-confirmation?orderNumber=${updatedOrder.orderNumber}`
    }, 'Payment confirmed successfully');

  } catch (error: any) {
    console.error('Error confirming payment:', error as Error);
    return errorResponse(
      (error as Error).message || 'Internal server error',
      500,
      'Failed to confirm payment'
    );
  }
}