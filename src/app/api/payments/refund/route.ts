import { NextRequest, NextResponse } from 'next/server';
import { createRefund } from '../../../../lib/stripe';
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
    const { orderId, amount, reason } = body;

    // Validate required fields
    if (!orderId) {
      return validationErrorResponse(['Order ID is required']);
    }

    // Get order details
    const order = await OrderModel.findById(orderId).populate('user');
    if (!order) {
      return notFoundResponse('Order not found');
    }

    // Check if user has permission to refund
    const isOwner = order.user._id.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return forbiddenResponse('Unauthorized access to order');
    }

    // Check if order is paid
    if (order.paymentStatus !== 'paid') {
      return errorResponse('Order is not paid or already refunded', 400);
    }

    // Check if payment intent exists
    if (!order.paymentIntentId) {
      return errorResponse('No payment found for this order', 400);
    }

    // Validate refund amount
    let refundAmount = amount;
    if (refundAmount) {
      if (typeof refundAmount !== 'number' || refundAmount <= 0) {
        return validationErrorResponse(['Invalid refund amount']);
      }
      if (refundAmount > (order.pricing?.total || 0)) {
        return errorResponse('Refund amount cannot exceed order total', 400);
      }
    }

    // Create refund
    const refundResult = await createRefund(
      order.paymentIntentId,
      refundAmount,
      reason
    );

    if (!refundResult.success) {
      return errorResponse(refundResult.error || 'Refund failed', 400);
    }

    // Update order status
    const orderTotal = order.pricing?.total || 0;
    const isFullRefund = !refundAmount || refundAmount === orderTotal;
    const orderUpdate: any = {
      refundStatus: isFullRefund ? 'refunded' : 'partial_refund',
      refundedAmount: (order.refundedAmount || 0) + (refundAmount || orderTotal),
      updatedAt: new Date(),
    };

    if (isFullRefund) {
      orderUpdate.paymentStatus = 'refunded';
      orderUpdate.status = 'cancelled';
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      order._id,
      orderUpdate,
      { new: true }
    );

    return successResponse({
      refund: {
        id: refundResult.refund!.id,
        amount: refundResult.refund!.amount / 100, // Convert from cents
        currency: refundResult.refund!.currency,
        status: refundResult.refund!.status,
        reason: refundResult.refund!.reason,
      },
      order: {
        id: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        refundStatus: updatedOrder.refundStatus,
        refundedAmount: updatedOrder.refundedAmount,
        paymentStatus: updatedOrder.paymentStatus,
        status: updatedOrder.status,
      },
    }, 'Refund processed successfully');

  } catch (error: any) {
    console.error('Error processing refund:', error as Error);
    return errorResponse(
      (error as Error).message || 'Internal server error',
      500,
      'Failed to process refund'
    );
  }
}