import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../dataBase/dbConfig";
import OrderModel from "../../../../models/order";
import { CartModel } from "../../../../models/cart";
import { ProductModel } from "../../../../models/product";
import { getTokenFromRequest, verifyToken } from "../../../lib/auth";
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  notFoundResponse,
  validationErrorResponse 
} from "../../../lib/api-response";

// GET - Get user's orders
export async function GET(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Filters
    const status = searchParams.get('status');
    const query: any = { user: decoded.id };
    
    if (status) {
      query.status = status;
    }

    const orders = await OrderModel
      .find(query)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .catch((err) => {
        console.error("Error populating orders:", err);
        return [];
      });

    const totalOrders = await OrderModel.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    return successResponse({
      orders: orders || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, "Orders retrieved successfully");

  } catch (error) {
    console.error("Error getting orders:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get orders"
    );
  }
}

// POST - Create new order from cart
export async function POST(request: NextRequest) {
  try {
    console.log('Starting order creation process...');
    await connectToDataBase();
    console.log('Database connected successfully');

    const token = getTokenFromRequest(request);
    if (!token) {
      console.log('No authentication token found');
      return unauthorizedResponse("Authentication token required");
    }

    console.log('Token found, verifying...');
    const decoded = verifyToken(token);
    console.log('Token verified for user:', decoded.id);
    
    const { 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      notes 
    } = await request.json();

    console.log('Request data parsed successfully');

    // Validation
    const errors: string[] = [];
    
    if (!shippingAddress) {
      errors.push("Shipping address is required");
    } else {
      if (!shippingAddress.fullName) errors.push("Full name is required");
      if (!shippingAddress.phone) errors.push("Phone number is required");
      if (!shippingAddress.addressLine1) errors.push("Address line 1 is required");
      if (!shippingAddress.city) errors.push("City is required");
      if (!shippingAddress.state) errors.push("State is required");
      if (!shippingAddress.postalCode) errors.push("Postal code is required");
    }

    if (!paymentMethod || !['card', 'upi', 'netbanking', 'wallet', 'cod', 'bank_transfer'].includes(paymentMethod)) {
      errors.push("Valid payment method is required");
    }

    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return validationErrorResponse(errors);
    }

    console.log('Validation passed, fetching cart...');
    // Get user's cart
    const cart = await CartModel
      .findOne({ user: decoded.id })
      .populate('items.product');

    console.log('Cart fetched:', cart ? `${cart.items.length} items` : 'null');

    if (!cart || cart.items.length === 0) {
      console.log('Cart is empty or not found');
      return errorResponse("Cart is empty", 400);
    }

    console.log('Cart validation passed, checking product availability...');
    // Validate cart items and stock
    for (const item of cart.items) {
      const product = item.product as any;
      
      if (!product || product.status !== 'active') {
        console.log('Product unavailable:', product?.name || 'Unknown');
        return errorResponse(`Product ${product?.name || 'Unknown'} is no longer available`, 400);
      }
      
      if (product.stock < item.quantity) {
        console.log('Insufficient stock for:', product.name, 'Required:', item.quantity, 'Available:', product.stock);
        return errorResponse(
          `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
          400
        );
      }
    }

    console.log('Product validation passed, calculating pricing...');

    // Calculate pricing
    const subtotal = cart.items.reduce((total: number, item: any) => {
      return total + (item.priceAtTime * item.quantity);
    }, 0);

    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping for orders above ₹500
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shippingCost + tax;

    // Prepare order items
    const orderItems = cart.items.map((item: any) => ({
      product: item.product._id,
      productDetails: {
        name: item.product.name,
        image: item.product.images && item.product.images[0] ? item.product.images[0].url : '/placeholder-product.jpg',
        sku: item.product.sku || '' // Handle missing SKU
      },
      quantity: item.quantity,
      price: item.priceAtTime,
      selectedVariants: item.selectedVariants || [], // Handle missing variants
      vendor: item.product.vendor || null // Handle missing vendor
    }));

    console.log('Order items prepared, creating order...');
    
    // Generate order number manually to ensure it's created
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD${timestamp}${random}`;
    
    console.log('Generated order number:', orderNumber);
    
    // Create order with explicit orderNumber
    const order = await OrderModel.create({
      orderNumber,
      user: decoded.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method: paymentMethod,
        amount: total,
        status: paymentMethod === 'cod' ? 'pending' : 'pending'
      },
      pricing: {
        subtotal,
        shippingCost,
        tax,
        total
      },
      notes: {
        customer: notes || ''
      },
      // Add Stripe integration fields
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    console.log('Order created successfully:', order.orderNumber);

    // Update product stock and sales count
    console.log('Updating product stock...');
    for (const item of cart.items) {
      const product = item.product as any;
      await ProductModel.findByIdAndUpdate(product._id, {
        $inc: { 
          stock: -item.quantity,
          totalSold: item.quantity 
        }
      });
      console.log(`Updated stock for ${product.name}: -${item.quantity}`);
    }

    // Add initial tracking
    order.addTracking('pending', 'Order placed successfully');
    order.calculateEstimatedDelivery();
    await order.save();
    console.log('Order tracking added and saved');

    // Clear cart
    cart.items = [];
    await cart.save();
    console.log('Cart cleared successfully');

    // Populate order for response with better error handling
    try {
      await order.populate('items.product', 'name images');
      console.log('Order populated and ready to return');
    } catch (populateError) {
      console.error('Error populating order:', populateError);
      // If population fails, we'll still return the order with the productDetails we already have
    }

    console.log('Returning order with data:', {
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.user,
      items: order.items.length
    });

    // Ensure the order object has all required fields before returning
    const orderResponse = {
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.user,
      items: order.items,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      payment: order.payment,
      pricing: order.pricing,
      status: order.status,
      trackingHistory: order.trackingHistory,
      notes: order.notes,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    return successResponse(orderResponse, "Order placed successfully");
  } catch (error) {
    console.error("Error creating order:", error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('token') || error.message.includes('jwt')) {
        console.error('Authentication error:', error.message);
        return unauthorizedResponse("Invalid authentication token");
      }
      
      if (error.message.includes('validation')) {
        console.error('Validation error:', error.message);
        return errorResponse(error.message, 400, "Validation failed");
      }
      
      if (error.message.includes('MongoServerError') || error.message.includes('E11000')) {
        console.error('Database constraint error:', error.message);
        return errorResponse("Database error occurred", 500, "Failed to create order");
      }
      
      // Handle Stripe-related errors
      if (error.message.includes('Stripe') || error.message.includes('payment')) {
        console.error('Payment processing error (continuing with order):', error.message);
        // For demo purposes, we'll continue with the order even if payment processing fails
        // In a production environment, you might want to handle this differently
      }
    }
    
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to create order"
    );
  }
}
