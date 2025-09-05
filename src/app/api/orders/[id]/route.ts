import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

// GET /api/orders/[id] - Get a specific order by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: orderId } = params;
    
    if (!orderId) {
      return errorHandlers.apiErrorResponse('Order ID is required', 400);
    }
    
    console.log('Connecting to database...');
    const connection = await dbConnect();
    console.log('Database connection state:', connection.connection?.readyState);
    
    // Check if we have a real database connection
    if (connection.connection?.readyState !== 1) {
      console.log('Database connection not available');
      return errorHandlers.apiErrorResponse('Database connection not available', 500);
    }
    
    // Fetch the specific order from the database with populated fields
    const order: any = await Order.findOne({ orderId })
      .populate('customer', 'name email')
      .populate('vendor', 'name')
      .populate('items.product');
    
    if (!order) {
      return errorHandlers.apiErrorResponse('Order not found', 404);
    }
    
    // Transform order to match the frontend expectations
    const transformedOrder = {
      id: order._id.toString(),
      orderId: order.orderId,
      customer: order.customer?.name || 'Unknown Customer',
      customerId: order.customer?._id?.toString() || null,
      vendor: order.vendor?.name || 'Unknown Vendor',
      vendorId: order.vendor?._id?.toString() || null,
      date: new Date(order.createdAt).toISOString().split('T')[0],
      amount: order.totalAmount,
      status: order.status,
      items: order.items?.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })) || [],
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.paymentIntentId,
    };
    
    logger.info('Order fetched successfully', { orderId: order.orderId });
    
    return NextResponse.json({ order: transformedOrder });
  } catch (error: unknown) {
    console.error('Error fetching order:', error);
    errorHandlers.logError(logger, 'Error fetching order', error);
    return errorHandlers.apiErrorResponse('Failed to fetch order');
  }
}