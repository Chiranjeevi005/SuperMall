import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-response";
import { verifyToken } from "@/lib/auth";
import { connectToDataBase } from "../../../../dataBase/dbConfig";
import { CategoryModel } from "../../../../models/category";

// GET /api/categories - Get all categories or category tree
export async function GET(request: NextRequest) {
  try {
    await connectToDataBase();

    const { searchParams } = new URL(request.url);
    const tree = searchParams.get('tree');
    const parentId = searchParams.get('parentId');
    const level = searchParams.get('level');
    const active = searchParams.get('active');
    const search = searchParams.get('search');

    let query: any = {};

    // Filter by active status
    if (active !== null) {
      query.isActive = active === 'true';
    }

    // Filter by parent category
    if (parentId) {
      query.parentCategory = parentId === 'null' ? null : parentId;
    }

    // Filter by level
    if (level) {
      query.level = parseInt(level);
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    if (tree === 'true') {
      // Return hierarchical tree structure
      const categoryTree = await (CategoryModel as any).getCategoryTree();
      return successResponse(categoryTree, "Category tree retrieved successfully");
    } else {
      // Return flat list of categories
      const categories = await CategoryModel
        .find(query)
        .populate('parentCategory', 'name slug')
        .populate('createdBy', 'name email')
        .sort({ level: 1, sortOrder: 1, name: 1 });

      return successResponse(categories, "Categories retrieved successfully");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to fetch categories"
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return errorResponse("Authentication required", 401, "Access denied");
    }

    const decoded = verifyToken(token);
    if (!decoded || !['admin', 'vendor'].includes(decoded.role)) {
      return errorResponse("Insufficient permissions", 403, "Access denied");
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      image, 
      parentCategory, 
      sortOrder,
      seoTitle,
      seoDescription 
    } = body;

    // Validate input
    const errors: string[] = [];
    if (!name || name.trim().length < 2) {
      errors.push("Category name must be at least 2 characters long");
    }
    if (name && name.length > 100) {
      errors.push("Category name must not exceed 100 characters");
    }
    if (description && description.length > 500) {
      errors.push("Description must not exceed 500 characters");
    }

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // Check if category with same name already exists at the same level
    const existingQuery: any = { name: name.trim() };
    if (parentCategory) {
      existingQuery.parentCategory = parentCategory;
    } else {
      existingQuery.parentCategory = null;
    }

    const existingCategory = await CategoryModel.findOne(existingQuery);
    if (existingCategory) {
      return errorResponse(
        "Category with this name already exists at this level", 
        409, 
        "Duplicate category"
      );
    }

    // Validate parent category if provided
    if (parentCategory) {
      const parent = await CategoryModel.findById(parentCategory);
      if (!parent) {
        return errorResponse("Parent category not found", 404, "Invalid parent");
      }
      if (parent.level >= 2) {
        return errorResponse(
          "Maximum category depth of 3 levels exceeded", 
          400, 
          "Invalid depth"
        );
      }
    }

    // Create category
    const category = await CategoryModel.create({
      name: name.trim(),
      description: description?.trim() || "",
      image: image || { url: "", alt: "" },
      parentCategory: parentCategory || null,
      sortOrder: sortOrder || 0,
      seoTitle: seoTitle?.trim() || "",
      seoDescription: seoDescription?.trim() || "",
      createdBy: decoded.id
    });

    await category.populate('parentCategory', 'name slug');
    await category.populate('createdBy', 'name email');

    return successResponse(category, "Category created successfully");

  } catch (error) {
    console.error("Error creating category:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to create category"
    );
  }
}

// PUT /api/categories - Update multiple categories (for bulk operations)
export async function PUT(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return errorResponse("Authentication required", 401, "Access denied");
    }

    const decoded = verifyToken(token);
    if (!decoded || !['admin'].includes(decoded.role)) {
      return errorResponse("Admin access required", 403, "Access denied");
    }

    const body = await request.json();
    const { operations } = body;

    if (!Array.isArray(operations)) {
      return validationErrorResponse(["Operations must be an array"]);
    }

    const results = [];
    for (const operation of operations) {
      try {
        const { id, action, data } = operation;
        
        switch (action) {
          case 'activate':
            await CategoryModel.findByIdAndUpdate(id, { isActive: true });
            results.push({ id, success: true, action });
            break;
          case 'deactivate':
            await CategoryModel.findByIdAndUpdate(id, { isActive: false });
            results.push({ id, success: true, action });
            break;
          case 'updateOrder':
            await CategoryModel.findByIdAndUpdate(id, { sortOrder: data.sortOrder });
            results.push({ id, success: true, action });
            break;
          default:
            results.push({ id, success: false, action, error: 'Unknown action' });
        }
      } catch (error) {
        results.push({ 
          id: operation.id, 
          success: false, 
          action: operation.action, 
          error: (error as Error).message 
        });
      }
    }

    return successResponse(results, "Bulk operations completed");

  } catch (error) {
    console.error("Error in bulk category operations:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to perform bulk operations"
    );
  }
}