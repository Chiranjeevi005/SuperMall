import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import OrderModel from "../../../../../models/order";
import { ProductModel } from "../../../../../models/product";
import { getTokenFromRequest, verifyToken } from "../../../../lib/auth";
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  notFoundResponse,
  forbiddenResponse,
  validationErrorResponse 
} from "../../../../lib/api-response";

// GET - Get single order details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);

    // Get order ID from params with better error handling
    const orderId = params.id;
    
    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      return notFoundResponse("Order ID is required");
    }

    const trimmedOrderId = orderId.trim();
    console.log('Searching for order with ID:', trimmedOrderId);

    // Try to find by _id first, then by orderNumber if not found
    let order: any = await OrderModel
      .findById(trimmedOrderId)
      .populate('items.product', 'name images')
      .populate('user', 'name email')
      .populate('trackingHistory.updatedBy', 'name')
      .lean()
      .catch((err) => {
        console.error("Error finding order by ID:", err);
        return null;
      });

    console.log('Order found by _id:', !!order);

    // If not found by _id, try by orderNumber
    if (!order) {
      console.log('Trying to find order by orderNumber:', trimmedOrderId);
      order = await OrderModel
        .findOne({ orderNumber: trimmedOrderId })
        .populate('items.product', 'name images')
        .populate('user', 'name email')
        .populate('trackingHistory.updatedBy', 'name')
        .lean()
        .catch((err) => {
          console.error("Error finding order by orderNumber:", err);
          return null;
        });
      console.log('Order found by orderNumber:', !!order);
    }

    if (!order) {
      console.log('Order not found with ID:', trimmedOrderId);
      return notFoundResponse("Order not found");
    }

    // Check permissions
    // Add additional safety checks for user property
    if (!order.user) {
      console.error("Order found but missing user property:", order);
      return errorResponse(
        "Order data is incomplete",
        500,
        "Failed to retrieve order"
      );
    }

    const isOwner = order.user._id?.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';
    const isVendor = decoded.role === 'vendor' && 
      order.items?.some((item: any) => item.vendor && item.vendor.toString() === decoded.id);

    if (!isOwner && !isAdmin && !isVendor) {
      return forbiddenResponse("You don't have permission to view this order");
    }

    console.log('Order retrieved successfully:', order.orderNumber);
    return successResponse(order, "Order retrieved successfully");

  } catch (error) {
    console.error("Error getting order:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get order"
    );
  }
}

// PUT - Update order status (Admin/Vendor only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    
    // Only admin and vendors can update order status
    if (!['admin', 'vendor'].includes(decoded.role)) {
      return forbiddenResponse("Only admins and vendors can update order status");
    }

    const requestBody = await request.json().catch(() => ({}));
    const { status, message, location, shippingTrackingNumber, shippingCarrier } = requestBody;

    // Validation
    const validStatuses = [
      'pending', 'confirmed', 'processing', 'shipped', 
      'out_for_delivery', 'delivered', 'cancelled', 'returned'
    ];

    if (!status || !validStatuses.includes(status)) {
      return validationErrorResponse([`Status must be one of: ${validStatuses.join(', ')}`]);
    }

    console.log('Attempting to find order with ID:', params.id);
    const order = await OrderModel.findById(params.id);
    if (!order) {
      console.log('Order not found with ID:', params.id);
      return notFoundResponse("Order not found");
    }
    
    console.log('Order found:', {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status
    });

    // Check vendor permissions
    if (decoded.role === 'vendor') {
      const hasVendorItems = order.items.some(
        (item: any) => item.vendor && item.vendor.toString() === decoded.id
      );
      
      if (!hasVendorItems) {
        return forbiddenResponse("You can only update orders containing your products");
      }
    }

    // Update order
    const updateData: any = {};
    
    if (shippingTrackingNumber) updateData.shippingTrackingNumber = shippingTrackingNumber;
    if (shippingCarrier) updateData.shippingCarrier = shippingCarrier;

    // Handle payment status for COD orders
    if (status === 'delivered' && order.payment && order.payment.method === 'cod') {
      updateData['payment.status'] = 'completed';
      updateData['payment.paidAt'] = new Date();
    }

    // Handle delivery date
    if (status === 'delivered') {
      updateData.actualDelivery = new Date();
    }

    try {
      await OrderModel.findByIdAndUpdate(params.id, updateData);
      console.log('Order successfully updated with data:', updateData);
    } catch (updateError) {
      console.error("Error updating order:", updateError);
    }

    // Add tracking entry
    order.addTracking(status, message, location, decoded.id);
    await order.save();

    // Populate and return updated order
    try {
      await order.populate('items.product', 'name images');
      console.log('Successfully populated items');
    } catch (populateError) {
      console.error("Error populating items:", populateError);
    }
    
    try {
      await order.populate('trackingHistory.updatedBy', 'name');
      console.log('Successfully populated tracking history');
    } catch (populateError) {
      console.error("Error populating tracking history:", populateError);
    }

    console.log('Order status updated successfully:', order.orderNumber);
    return successResponse(order, "Order status updated successfully");

  } catch (error) {
    console.error("Error updating order:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to update order"
    );
  }
}

// DELETE - Cancel order (Customer/Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    const requestBody = await request.json().catch(() => ({}));
    const { reason } = requestBody;

    console.log('Attempting to find order with ID:', params.id);
    
    const order = await OrderModel.findById(params.id);
    if (!order) {
      console.log('Order not found with ID:', params.id);
      return notFoundResponse("Order not found");
    }

    console.log('Order found:', {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      user: order.user
    });

    // Check permissions
    const isOwner = order.user.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';

    if (!isOwner && !isAdmin) {
      return forbiddenResponse("You can only cancel your own orders");
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    if (!cancellableStatuses.includes(order.status)) {
      return errorResponse(
        "Order cannot be cancelled at this stage",
        400,
        "Cancellation not allowed"
      );
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellationReason = reason || 'Cancelled by customer';
    order.addTracking('cancelled', reason || 'Order cancelled', undefined, decoded.id);

    // Restore product stock
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        // Make sure item.product exists and is a valid ObjectId
        if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
          try {
            console.log('Updating product stock for product ID:', item.product);
            await ProductModel.findByIdAndUpdate(item.product, {
              $inc: { 
                stock: item.quantity,
                totalSold: -item.quantity 
              }
            });
            console.log('Successfully updated product stock for product ID:', item.product);
          } catch (productError) {
            console.error("Error updating product stock for product ID:", item.product, productError);
            // Continue with other items even if one fails
          }
        } else {
          console.warn("Invalid product ID in order item:", item);
        }
      }
    } else {
      console.warn("Order items are missing or not an array:", order.items);
    }

    await order.save();
    console.log('Order successfully cancelled and saved:', order.orderNumber);

    return successResponse(
      { id: params.id, status: 'cancelled' },
      "Order cancelled successfully"
    );

  } catch (error) {
    console.error("Error cancelling order:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to cancel order"
    );
  }
}
