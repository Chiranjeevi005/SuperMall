import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User'; // This import should register the model
import Product from '@/models/Product'; // Also import Product to ensure it's registered
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';
import emailService from '@/services/emailService';
import { authMiddleware } from '@/middleware/authMiddleware';

// Function to generate a unique order ID
function generateOrderId(): string {
  // Use timestamp + random component for uniqueness
  const timestamp = Date.now().toString();
  const randomComponent = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORDER-${timestamp}-${randomComponent}`;
}

// Function to generate a UUID (fallback method)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    // Apply authentication middleware
    const authResult = await authMiddleware(request, {} as any);
    if (authResult) return authResult;
    
    // Get user from request
    const user = (request as any).user;
    if (!user) {
      return errorHandlers.apiErrorResponse('User not authenticated', 401);
    }
    
    console.log('Connecting to database...');
    const connection = await dbConnect();
    console.log('Database connection state:', connection.connection?.readyState);
    
    // Check if we have a real database connection
    if (connection.connection?.readyState !== 1) {
      console.log('Database connection not available');
      // In production, we should throw an error instead of returning mock data
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Database connection failed');
      }
      // Return mock data when database is not available (development only)
      return NextResponse.json({ orders: [] });
    }
    
    // Fetch orders from the database with populated fields
    // Non-admin users can only see their own orders
    const query = user.role === 'admin' ? {} : { customer: user.id };
    
    const orders: any = await Order.find(query)
      .populate('customer', 'name email')
      .populate('vendor', 'name')
      .populate('items.product') // Also populate product details
      .sort({ createdAt: -1 });
    
    // Transform orders to match the frontend expectations
    const transformedOrders = orders.map((order: any) => ({
      id: order._id.toString(),
      orderId: order.orderId,
      customer: order.customer?.name || 'Unknown Customer',
      customerId: order.customer?._id?.toString() || null,
      vendor: order.vendor?.name || 'Unknown Vendor',
      vendorId: order.vendor?._id?.toString() || null,
      date: new Date(order.createdAt).toISOString().split('T')[0],
      amount: order.totalAmount,
      status: order.status,
      items: order.items?.length || 0,
    }));
    
    logger.info('Orders fetched successfully', { count: orders.length });
    
    return NextResponse.json({ orders: transformedOrders });
  } catch (error: unknown) {
    console.error('Error fetching orders:', error);
    errorHandlers.logError(logger, 'Error fetching orders', error);
    // In production, we should return an error instead of mock data
    if (process.env.NODE_ENV === 'production') {
      return errorHandlers.apiErrorResponse('Failed to fetch orders');
    }
    // Return empty array as fallback (development only)
    return NextResponse.json({ orders: [] });
  }
}

// GET /api/orders/[id] - Get a specific order by ID
export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Apply authentication middleware
    const authResult = await authMiddleware(request, {} as any);
    if (authResult) return authResult;
    
    // Get user from request
    const user = (request as any).user;
    if (!user) {
      return errorHandlers.apiErrorResponse('User not authenticated', 401);
    }
    
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
      // In production, we should throw an error
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Database connection failed');
      }
      return errorHandlers.apiErrorResponse('Database connection not available', 500);
    }
    
    // Fetch the specific order from the database with populated fields
    // Non-admin users can only see their own orders
    const query = user.role === 'admin' ? { orderId } : { orderId, customer: user.id };
    
    const order: any = await Order.findOne(query)
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
    // In production, we should return an error
    if (process.env.NODE_ENV === 'production') {
      return errorHandlers.apiErrorResponse('Failed to fetch order');
    }
    return errorHandlers.apiErrorResponse('Failed to fetch order');
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    // Apply authentication middleware
    const authResult = await authMiddleware(request, {} as any);
    if (authResult) return authResult;
    
    console.log('Connecting to database...');
    const connection = await dbConnect();
    console.log('Database connection state:', connection.connection?.readyState);
    
    const body = await request.json();
    console.log('Order creation request body:', body);
    
    // Get user from request
    const user = (request as any).user;
    if (!user) {
      return errorHandlers.apiErrorResponse('User not authenticated', 401);
    }
    
    // Validate that body exists
    if (!body) {
      console.log('No request body provided');
      return errorHandlers.apiErrorResponse('No request body provided', 400);
    }
    
    // Set customer ID from authenticated user
    body.customer = user.id;
    
    // Validate required fields
    const requiredFields = ['vendor', 'items', 'totalAmount', 'shippingAddress', 'paymentMethod'];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Missing required field: ${field}`);
        return errorHandlers.apiErrorResponse(`${field} is required`, 400);
      }
    }
    
    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      console.log('Invalid items array');
      return errorHandlers.apiErrorResponse('Items array is required and cannot be empty', 400);
    }
    
    // Validate each item
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      if (!item.product || !item.quantity || !item.price) {
        console.log(`Invalid item at index ${i}:`, item);
        return errorHandlers.apiErrorResponse(`Item ${i+1} is missing required fields`, 400);
      }
    }
    
    // Validate shipping address
    const shippingAddress = body.shippingAddress;
    const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        console.log(`Missing required shipping address field: ${field}`);
        return errorHandlers.apiErrorResponse(`Shipping address ${field} is required`, 400);
      }
    }
    
    // Validate total amount
    if (typeof body.totalAmount !== 'number' || body.totalAmount < 0) {
      console.log('Invalid total amount:', body.totalAmount);
      return errorHandlers.apiErrorResponse('Invalid total amount', 400);
    }
    
    // Check if we have a real database connection
    if (connection.connection?.readyState !== 1) {
      console.log('Database connection not available');
      // In production, we should throw an error instead of creating a mock order
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Database connection failed');
      }
      // Create a mock order when database is not available (development only)
      const mockOrder = {
        id: generateUUID(),
        orderId: generateOrderId(),
      };
      
      return NextResponse.json({ 
        message: 'Order created successfully (mock)',
        order: mockOrder
      });
    }
    
    // Generate unique order ID with retry mechanism
    let orderId: string;
    let order: any;
    let retries = 0;
    const maxRetries = 3; // Limit retries to prevent infinite loops
    
    while (retries <= maxRetries) {
      // Generate a new order ID for each attempt
      orderId = generateOrderId();
      console.log('Generated order ID:', orderId);
      
      // Validate that orderId is not null/undefined
      if (!orderId) {
        console.error('Failed to generate order ID');
        return errorHandlers.apiErrorResponse('Failed to generate order ID', 500);
      }
      
      try {
        // Create the order
        const orderData = {
          ...body,
          orderId,
        };
        
        console.log('Creating order with data:', orderData);
        order = await Order.create(orderData);
        console.log('Order created successfully:', order._id);
        break; // Success, exit the retry loop
      } catch (error: any) {
        retries++;
        console.log(`Attempt ${retries} failed:`, error.message);
        
        // If it's not a duplicate key error, rethrow immediately
        if (!(error.name === 'MongoServerError' && error.code === 11000)) {
          throw error;
        }
        
        // If we've reached max retries, return error
        if (retries > maxRetries) {
          console.error('Failed to create order after retries:', error.message);
          return errorHandlers.apiErrorResponse('Duplicate orderId, please retry', 409);
        }
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100 * retries));
      }
    }
    
    // Populate customer and vendor details for email
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('vendor', 'name');
    
    // Send order confirmation email
    if (populatedOrder && populatedOrder.customer && populatedOrder.customer.email) {
      await emailService.sendOrderConfirmation(populatedOrder.customer.email, {
        orderId: populatedOrder.orderId,
        totalAmount: populatedOrder.totalAmount,
        items: populatedOrder.items,
        shippingAddress: populatedOrder.shippingAddress,
      });
    }
    
    logger.info('Order created successfully', { orderId: order.orderId });
    
    return NextResponse.json({ 
      message: 'Order created successfully',
      order: {
        id: order._id.toString(),
        orderId: order.orderId,
      }
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      // Check for MongoDB duplicate key error
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        console.error('Duplicate key error details:', (error as any).keyValue);
        // Return a more appropriate error message for duplicate key errors
        return errorHandlers.apiErrorResponse('Duplicate orderId, please retry', 409);
      }
      // Check for MongoDB connection errors
      if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
        // In production, we should return an error instead of mock data
        if (process.env.NODE_ENV === 'production') {
          throw error;
        }
        // Return mock order as fallback (development only)
        return NextResponse.json({ 
          message: 'Order created successfully (mock due to database connection issue)',
          order: {
            id: generateUUID(),
            orderId: generateOrderId(),
          }
        });
      }
    }
    errorHandlers.logError(logger, 'Error creating order', error);
    // In production, we should return an error
    if (process.env.NODE_ENV === 'production') {
      return errorHandlers.apiErrorResponse('Failed to create order: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
    return errorHandlers.apiErrorResponse('Failed to create order: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// PUT /api/orders - Update order status
export async function PUT(request: NextRequest) {
  try {
    // Apply authentication middleware
    const authResult = await authMiddleware(request, {} as any);
    if (authResult) return authResult;
    
    // Get user from request
    const user = (request as any).user;
    if (!user) {
      return errorHandlers.apiErrorResponse('User not authenticated', 401);
    }
    
    const connection = await dbConnect();
    
    // Check if we have a real database connection
    if (connection.connection?.readyState !== 1) {
      // In production, we should throw an error instead of returning mock data
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Database connection failed');
      }
      // Return success for mock update (development only)
      return NextResponse.json({ 
        message: 'Order status updated successfully (mock)',
        order: {
          id: 'mock-id',
          orderId: 'ORDER-2023-001234',
          status: 'processing'
        }
      });
    }
    
    const body = await request.json();
    const { orderId, status, trackingInfo } = body;
    
    // Validate input
    if (!orderId || !status) {
      return errorHandlers.apiErrorResponse('Order ID and status are required', 400);
    }
    
    // Validate that the user has permission to update this order
    // For now, we'll allow admins and the order owner to update
    // In a real implementation, you might want more sophisticated permission checking
    const order = await Order.findOne({ orderId });
    if (!order) {
      return errorHandlers.apiErrorResponse('Order not found', 404);
    }
    
    // Check if user is admin or the order owner
    if (user.role !== 'admin' && order.customer.toString() !== user.id) {
      return errorHandlers.apiErrorResponse('Insufficient permissions to update this order', 403);
    }
    
    // Update the order in the database
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, trackingInfo },
      { new: true }
    ).populate('customer', 'name email');
    
    if (!updatedOrder) {
      return errorHandlers.apiErrorResponse('Order not found', 404);
    }
    
    // Send notification email based on status
    if (updatedOrder.customer && updatedOrder.customer.email) {
      switch (status) {
        case 'shipped':
          await emailService.sendShippingNotification(updatedOrder.customer.email, {
            orderId: updatedOrder.orderId,
            trackingInfo: updatedOrder.trackingInfo,
          });
          break;
        case 'delivered':
          await emailService.sendDeliveryNotification(updatedOrder.customer.email, {
            orderId: updatedOrder.orderId,
          });
          break;
      }
    }
    
    logger.info('Order status updated', { orderId, status });
    
    return NextResponse.json({ 
      message: 'Order status updated successfully',
      order: {
        id: updatedOrder._id.toString(),
        orderId: updatedOrder.orderId,
        status: updatedOrder.status
      }
    });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Error updating order status', error);
    // In production, we should return an error instead of mock data
    if (process.env.NODE_ENV === 'production') {
      return errorHandlers.apiErrorResponse('Failed to update order status');
    }
    // Return success for mock update even in error case (development only)
    return NextResponse.json({ 
      message: 'Order status updated successfully (mock)',
      order: {
        id: 'mock-id',
        orderId: 'ORDER-2023-001234',
        status: 'processing'
      }
    });
  }
}