import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../../../dataBase/dbConfig";
import { ProductModel } from "../../../../../../models/product";
import { getTokenFromRequest, verifyToken } from "../../../../../lib/auth";
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse 
} from "../../../../../lib/api-response";

// POST - Add review to product
export async function POST(
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
    const { rating, comment } = await request.json();

    // Validation
    const errors: string[] = [];
    if (!rating || rating < 1 || rating > 5) {
      errors.push("Rating must be between 1 and 5");
    }
    if (!comment || comment.trim().length < 5) {
      errors.push("Comment must be at least 5 characters long");
    }

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // Find the product
    const product = await ProductModel.findById(params.id);
    if (!product) {
      return notFoundResponse("Product not found");
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      (review: any) => review.user.toString() === decoded.id
    );

    if (existingReview) {
      return errorResponse(
        "You have already reviewed this product",
        400,
        "Duplicate review"
      );
    }

    // Add review
    product.reviews.push({
      user: decoded.id,
      rating,
      comment: comment.trim(),
      createdAt: new Date()
    });

    // Update average rating
    product.updateRating();
    await product.save();

    // Populate the new review with user info
    await product.populate('reviews.user', 'name');

    return successResponse(
      product.reviews[product.reviews.length - 1],
      "Review added successfully"
    );

  } catch (error) {
    console.error("Error adding review:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to add review"
    );
  }
}

// GET - Get product reviews
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDataBase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const product = await ProductModel
      .findById(params.id)
      .populate('reviews.user', 'name')
      .select('reviews averageRating totalReviews');

    if (!product) {
      return notFoundResponse("Product not found");
    }

    // Paginate reviews
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = product.reviews
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(startIndex, endIndex);

    const totalPages = Math.ceil(product.reviews.length / limit);

    return successResponse({
      reviews: paginatedReviews,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, "Reviews retrieved successfully");

  } catch (error) {
    console.error("Error getting reviews:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get reviews"
    );
  }
}