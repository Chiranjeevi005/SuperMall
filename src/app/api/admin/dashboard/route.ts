import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import { ProductModel } from "../../../../../models/product";
import { CategoryModel } from "../../../../../models/category";
import UserModel from "../../../../../models/user";
import { getTokenFromRequest, verifyToken } from "../../../../lib/auth";
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  forbiddenResponse 
} from "../../../../lib/api-response";

// GET - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    if (decoded.role !== 'admin') {
      return forbiddenResponse("Admin access required");
    }

    // Fetch all statistics in parallel
    const [
      totalUsers,
      totalVendors,
      totalProducts,
      totalCategories,
      productsWithLowStock,
      productsWithRatings
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ role: 'vendor' }),
      ProductModel.countDocuments(),
      CategoryModel.countDocuments(),
      ProductModel.countDocuments({ stock: { $lte: 5 } }),
      ProductModel.find({ averageRating: { $gt: 0 } }, 'averageRating')
    ]);

    // Calculate average rating
    let totalRating = 0;
    let ratingCount = 0;
    productsWithRatings.forEach((product: any) => {
      totalRating += product.averageRating;
      ratingCount++;
    });
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    const stats = {
      totalUsers,
      totalVendors,
      totalProducts,
      totalCategories,
      totalOrders: 0, // This would require order model
      totalRevenue: 0, // This would require order model
      averageRating,
      lowStockProducts: productsWithLowStock
    };

    return successResponse(stats, "Dashboard statistics retrieved successfully");

  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get dashboard statistics"
    );
  }
}