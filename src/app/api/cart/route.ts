import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../dataBase/dbConfig";
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

// GET - Get user's cart
export async function GET(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);

    let cart = await CartModel
      .findOne({ user: decoded.id })
      .populate({
        path: 'items.product',
        select: 'name price images stock status'
      });

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = await CartModel.create({ user: decoded.id, items: [] });
    }

    return successResponse(cart, "Cart retrieved successfully");

  } catch (error) {
    console.error("Error getting cart:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get cart"
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    const { productId, quantity = 1, selectedVariants = [] } = await request.json();

    // Validation
    const errors: string[] = [];
    if (!productId) errors.push("Product ID is required");
    if (!quantity || quantity < 1) errors.push("Quantity must be at least 1");

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // Check if product exists and is available
    const product = await ProductModel.findById(productId);
    if (!product) {
      return notFoundResponse("Product not found");
    }

    if (product.status !== 'active') {
      return errorResponse("Product is not available", 400);
    }

    if (product.stock < quantity) {
      return errorResponse(
        `Only ${product.stock} items available in stock`,
        400,
        "Insufficient stock"
      );
    }

    // Find or create cart
    let cart = await CartModel.findOne({ user: decoded.id });
    if (!cart) {
      cart = new CartModel({ user: decoded.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return errorResponse(
          `Only ${product.stock} items available in stock`,
          400,
          "Insufficient stock"
        );
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        priceAtTime: product.price,
        selectedVariants,
        addedAt: new Date()
      });
    }

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price images stock status'
    });

    return successResponse(cart, "Item added to cart successfully");

  } catch (error) {
    console.error("Error adding to cart:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to add item to cart"
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    const { productId, quantity } = await request.json();

    // Validation
    const errors: string[] = [];
    if (!productId) errors.push("Product ID is required");
    if (quantity === undefined || quantity < 0) errors.push("Valid quantity is required");

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const cart = await CartModel.findOne({ user: decoded.id });
    if (!cart) {
      return notFoundResponse("Cart not found");
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.items = cart.items.filter(
        (item: any) => item.product.toString() !== productId
      );
    } else {
      // Check stock availability
      const product = await ProductModel.findById(productId);
      if (!product) {
        return notFoundResponse("Product not found");
      }

      if (product.stock < quantity) {
        return errorResponse(
          `Only ${product.stock} items available in stock`,
          400,
          "Insufficient stock"
        );
      }

      // Update quantity
      const itemIndex = cart.items.findIndex(
        (item: any) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        return notFoundResponse("Item not found in cart");
      }

      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price images stock status'
    });

    return successResponse(cart, "Cart updated successfully");

  } catch (error) {
    console.error("Error updating cart:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to update cart"
    );
  }
}

// DELETE - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);

    const cart = await CartModel.findOne({ user: decoded.id });
    if (!cart) {
      return notFoundResponse("Cart not found");
    }

    cart.items = [];
    await cart.save();

    return successResponse(cart, "Cart cleared successfully");

  } catch (error) {
    console.error("Error clearing cart:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to clear cart"
    );
  }
}