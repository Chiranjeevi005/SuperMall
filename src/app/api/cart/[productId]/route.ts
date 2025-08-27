import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import { CartModel } from "../../../../../models/cart";
import { getTokenFromRequest, verifyToken } from "../../../../lib/auth";
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  notFoundResponse 
} from "../../../../lib/api-response";

// DELETE - Remove specific item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
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

    // Check if item exists in cart
    const itemExists = cart.items.some(
      (item: any) => item.product.toString() === params.productId
    );

    if (!itemExists) {
      return notFoundResponse("Item not found in cart");
    }

    // Remove item
    cart.items = cart.items.filter(
      (item: any) => item.product.toString() !== params.productId
    );

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price images stock status'
    });

    return successResponse(cart, "Item removed from cart successfully");

  } catch (error) {
    console.error("Error removing item from cart:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to remove item from cart"
    );
  }
}