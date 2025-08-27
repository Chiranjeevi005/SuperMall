import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../dataBase/dbConfig";
import { ProductModel } from "../../../../models/product";
import { getTokenFromRequest, verifyToken } from "../../../lib/auth";
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse 
} from "../../../lib/api-response";

// GET - Get products with search, filter, and pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDataBase();

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const brand = searchParams.get('brand') || '';
    const rating = parseFloat(searchParams.get('rating') || '0');
    const featured = searchParams.get('featured') === 'true';
    const trending = searchParams.get('trending') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const inStock = searchParams.get('inStock') === 'true';
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    const query: any = { status: 'active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) query.category = { $regex: category, $options: 'i' };
    if (subcategory) query.subcategory = { $regex: subcategory, $options: 'i' };
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (minPrice > 0 || maxPrice < 999999) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (rating > 0) query.averageRating = { $gte: rating };
    if (featured) query.featured = true;
    if (trending) query.trending = true;
    if (newArrival) query.newArrival = true;
    if (inStock) query.stock = { $gt: 0 };

    // Execute query
    const products = await ProductModel
      .find(query)
      .populate('vendor', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalProducts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get categories and brands for filters
    const categories = await ProductModel.distinct('category', { status: 'active' });
    const brands = await ProductModel.distinct('brand', { status: 'active' });

    return successResponse({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        categories,
        brands
      }
    }, "Products retrieved successfully");

  } catch (error) {
    console.error("Error getting products:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get products"
    );
  }
}

// POST - Create new product (Admin/Vendor only)
export async function POST(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    
    // Check if user is admin or vendor
    if (!['admin', 'vendor'].includes(decoded.role)) {
      return forbiddenResponse("Only admins and vendors can create products");
    }

    const productData = await request.json();

    // Validation
    const errors: string[] = [];
    if (!productData.name || productData.name.trim().length < 2) {
      errors.push("Product name must be at least 2 characters long");
    }
    if (!productData.description || productData.description.trim().length < 10) {
      errors.push("Product description must be at least 10 characters long");
    }
    if (!productData.price || productData.price <= 0) {
      errors.push("Product price must be greater than 0");
    }
    if (!productData.category || productData.category.trim().length < 2) {
      errors.push("Product category is required");
    }
    if (!productData.images || !Array.isArray(productData.images) || productData.images.length === 0) {
      errors.push("At least one product image is required");
    }
    if (productData.stock === undefined || productData.stock < 0) {
      errors.push("Stock quantity must be 0 or greater");
    }

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // Set vendor
    productData.vendor = decoded.id;

    // Generate SKU if not provided
    if (!productData.sku) {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      productData.sku = `PRD${timestamp}${random}`;
    }

    const product = await ProductModel.create(productData);
    
    // Populate vendor info
    await product.populate('vendor', 'name email');

    return successResponse(product, "Product created successfully");

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