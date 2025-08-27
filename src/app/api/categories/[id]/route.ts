import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import { CategoryModel } from "../../../../../models/category";
import { ProductModel } from "../../../../../models/product";
import { verifyToken } from "@/lib/auth";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-response";

// GET /api/categories/[id] - Get a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDataBase();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeChildren = searchParams.get('includeChildren') === 'true';
    const includeProducts = searchParams.get('includeProducts') === 'true';

    const category = await CategoryModel
      .findById(id)
      .populate('parentCategory', 'name slug')
      .populate('createdBy', 'name email');

    if (!category) {
      return errorResponse("Category not found", 404, "Not found");
    }

    let result: any = category.toObject();

    // Include children if requested
    if (includeChildren) {
      result.children = await CategoryModel
        .find({ parentCategory: id, isActive: true })
        .sort({ sortOrder: 1, name: 1 });
    }

    // Include products if requested
    if (includeProducts) {
      const products = await ProductModel
        .find({ category: category.name, status: 'active' })
        .select('name slug price comparePrice images averageRating totalSold')
        .limit(10)
        .sort({ totalSold: -1 });
      
      result.products = products;
      result.totalProducts = await ProductModel.countDocuments({ 
        category: category.name, 
        status: 'active' 
      });
    }

    // Get full category path
    result.fullPath = await category.getFullPath();

    return successResponse(result, "Category retrieved successfully");

  } catch (error) {
    console.error("Error fetching category:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to fetch category"
    );
  }
}

// PUT /api/categories/[id] - Update a specific category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();

    // Find existing category
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      return errorResponse("Category not found", 404, "Not found");
    }

    // Check permissions for vendors
    if (decoded.role === 'vendor' && existingCategory.createdBy.toString() !== decoded.id) {
      return errorResponse("You can only edit categories you created", 403, "Access denied");
    }

    const { 
      name, 
      description, 
      image, 
      parentCategory, 
      sortOrder,
      seoTitle,
      seoDescription,
      isActive 
    } = body;

    // Validate input
    const errors: string[] = [];
    if (name && name.trim().length < 2) {
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

    // Check for name conflicts if name is being changed
    if (name && name.trim() !== existingCategory.name) {
      const conflictQuery: any = { 
        name: name.trim(),
        _id: { $ne: id } 
      };
      
      if (parentCategory !== undefined) {
        conflictQuery.parentCategory = parentCategory || null;
      } else {
        conflictQuery.parentCategory = existingCategory.parentCategory;
      }

      const conflictingCategory = await CategoryModel.findOne(conflictQuery);
      if (conflictingCategory) {
        return errorResponse(
          "Category with this name already exists at this level", 
          409, 
          "Duplicate category"
        );
      }
    }

    // Validate parent category if being changed
    if (parentCategory !== undefined && parentCategory !== existingCategory.parentCategory?.toString()) {
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
        
        // Check for circular references
        if (parentCategory === id) {
          return errorResponse("Category cannot be its own parent", 400, "Circular reference");
        }
        
        // Check if the new parent is a descendant of this category
        const descendants = await existingCategory.getAllChildren();
        if (descendants.some((desc: { _id: { toString: () => any; }; }) => desc._id.toString() === parentCategory)) {
          return errorResponse(
            "Cannot move category to its own descendant", 
            400, 
            "Circular reference"
          );
        }
      }
    }

    // Update category
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || "";
    if (image !== undefined) updateData.image = image;
    if (parentCategory !== undefined) updateData.parentCategory = parentCategory || null;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle?.trim() || "";
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription?.trim() || "";
    if (isActive !== undefined && decoded.role === 'admin') updateData.isActive = isActive;

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name slug')
     .populate('createdBy', 'name email');

    return successResponse(updatedCategory, "Category updated successfully");

  } catch (error) {
    console.error("Error updating category:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to update category"
    );
  }
}

// DELETE /api/categories/[id] - Delete a specific category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Find existing category
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      return errorResponse("Category not found", 404, "Not found");
    }

    // Check permissions for vendors
    if (decoded.role === 'vendor' && existingCategory.createdBy.toString() !== decoded.id) {
      return errorResponse("You can only delete categories you created", 403, "Access denied");
    }

    // Check if category has children
    const childrenCount = await CategoryModel.countDocuments({ parentCategory: id });
    if (childrenCount > 0) {
      return errorResponse(
        "Cannot delete category with subcategories. Please delete or move subcategories first.",
        400,
        "Has dependencies"
      );
    }

    // Check if category has products
    const productCount = await ProductModel.countDocuments({ category: existingCategory.name });
    if (productCount > 0) {
      return errorResponse(
        "Cannot delete category with products. Please move or delete products first.",
        400,
        "Has dependencies"
      );
    }

    // Delete category
    await CategoryModel.findByIdAndDelete(id);

    return successResponse(
      { id, name: existingCategory.name }, 
      "Category deleted successfully"
    );

  } catch (error) {
    console.error("Error deleting category:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to delete category"
    );
  }
}