import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import { ProductModel } from "../../../../../models/product";
import { getTokenFromRequest, verifyToken } from "../../../../lib/auth";
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse 
} from "../../../../lib/api-response";

// GET - Get single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDataBase();

    const product = await ProductModel
      .findById(params.id)
      .populate('vendor', 'name email')
      .populate('reviews.user', 'name')
      .lean();

    if (!product) {
      return notFoundResponse("Product not found");
    }

    // Ensure array properties are properly initialized
    (product as any).features = (product as any).features || [];
    (product as any).specifications = (product as any).specifications || [];
    (product as any).tags = (product as any).tags || [];
    (product as any).variants = (product as any).variants || [];
    (product as any).reviews = (product as any).reviews || [];
    (product as any).images = (product as any).images || [];

    // Ensure variants options are arrays
    if ((product as any).variants) {
      (product as any).variants = (product as any).variants.map((variant: any) => ({
        ...variant,
        options: variant.options || []
      }));
    }

    // Increment view count
    await ProductModel.findByIdAndUpdate(params.id, { $inc: { viewCount: 1 } });

    return successResponse(product, "Product retrieved successfully");

  } catch (error) {
    console.error("Error getting product:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get product"
    );
  }
}

// PUT - Update product (Admin/Owner only)
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
    
    // Find the product first
    const existingProduct = await ProductModel.findById(params.id);
    if (!existingProduct) {
      return notFoundResponse("Product not found");
    }

    // Check permissions
    const isOwner = existingProduct.vendor.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return forbiddenResponse("You can only update your own products");
    }

    const updateData = await request.json();

    // Remove fields that shouldn't be updated by vendors
    if (!isAdmin) {
      delete updateData.vendor;
      delete updateData.featured;
      delete updateData.trending;
      delete updateData.newArrival;
    }

    const product = await ProductModel
      .findByIdAndUpdate(params.id, updateData, { 
        new: true, 
        runValidators: true 
      })
      .populate('vendor', 'name email');

    return successResponse(product, "Product updated successfully");

  } catch (error) {
    console.error("Error updating product:", error);
    
    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyPattern)[0];
      return errorResponse(
        `Product with this ${field} already exists`,
        400,
        "Duplicate product"
      );
    }
    
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to update product"
    );
  }
}

// DELETE - Delete product (Admin/Owner only)
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
    
    // Find the product first
    const existingProduct = await ProductModel.findById(params.id);
    if (!existingProduct) {
      return notFoundResponse("Product not found");
    }

    // Check permissions
    const isOwner = existingProduct.vendor.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return forbiddenResponse("You can only delete your own products");
    }

    // Soft delete by changing status to inactive
    await ProductModel.findByIdAndUpdate(params.id, { status: 'inactive' });

    return successResponse(
      { id: params.id },
      "Product deleted successfully"
    );

  } catch (error) {
    console.error("Error deleting product:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to delete product"
    );
  }
}