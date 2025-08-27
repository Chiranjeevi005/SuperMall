import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import { ProductModel } from "../../../../../models/product";
import { getTokenFromRequest, verifyToken } from "../../../../lib/auth";
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  forbiddenResponse 
} from "../../../../lib/api-response";

// GET - Get vendor's products
export async function GET(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    if (decoded.role !== 'vendor' && decoded.role !== 'admin') {
      return forbiddenResponse("Vendor or admin access required");
    }

    // Fetch products belonging to this vendor
    const products = await ProductModel
      .find({ vendor: decoded.id })
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(products, "Products retrieved successfully");

  } catch (error) {
    console.error("Error getting vendor products:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get products"
    );
  }
}

// POST - Create new product by vendor
export async function POST(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    if (decoded.role !== 'vendor' && decoded.role !== 'admin') {
      return forbiddenResponse("Vendor or admin access required");
    }

    const productData = await request.json();

    // Ensure vendor is set to the authenticated user
    productData.vendor = decoded.id;

    const product = await ProductModel.create(productData);

    // Populate vendor info for response
    const populatedProduct = await ProductModel
      .findById(product._id)
      .populate('vendor', 'name');

    return successResponse(populatedProduct, "Product created successfully");

  } catch (error) {
    console.error("Error creating product:", error);
    
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
      "Failed to create product"
    );
  }
}