import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

// POST /api/categories/manage - Create a new category
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, description, icon } = body;
    
    // Validate input
    if (!name || !description) {
      return errorHandlers.apiErrorResponse('Name and description are required', 400);
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return errorHandlers.apiErrorResponse('Category with this name already exists', 400);
    }
    
    // Create new category
    const newCategory = new Category({
      name,
      description,
      icon,
      isActive: true,
    });
    
    await newCategory.save();
    
    logger.info('Category created', { categoryId: newCategory._id, name: newCategory.name });
    
    return NextResponse.json({ 
      message: 'Category created successfully',
      category: {
        id: newCategory._id,
        name: newCategory.name,
        description: newCategory.description,
        icon: newCategory.icon,
        status: newCategory.isActive ? 'active' : 'inactive',
        createdAt: newCategory.createdAt,
      }
    });
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return errorHandlers.apiErrorResponse('Invalid JSON format in request body', 400);
    }
    errorHandlers.logError(logger, 'Error creating category', error);
    return errorHandlers.apiErrorResponse('Failed to create category');
  }
}

// PUT /api/categories/manage - Update category status
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { categoryId, action } = body;
    
    // Validate input
    if (!categoryId || !action) {
      return errorHandlers.apiErrorResponse('Category ID and action are required', 400);
    }
    
    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return errorHandlers.apiErrorResponse('Category not found', 404);
    }
    
    // Update category status based on action
    if (action === 'activate') {
      category.isActive = true;
    } else if (action === 'deactivate') {
      category.isActive = false;
    } else {
      return errorHandlers.apiErrorResponse('Invalid action. Use "activate" or "deactivate"', 400);
    }
    
    await category.save();
    
    logger.info('Category status updated', { categoryId, action });
    
    return NextResponse.json({ 
      message: `Category ${action}d successfully`,
      category: {
        id: category._id,
        name: category.name,
        status: category.isActive ? 'active' : 'inactive',
      }
    });
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return errorHandlers.apiErrorResponse('Invalid JSON format in request body', 400);
    }
    errorHandlers.logError(logger, 'Error updating category status', error);
    return errorHandlers.apiErrorResponse('Failed to update category status');
  }
}

// DELETE /api/categories/manage - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');
    
    // Validate input
    if (!categoryId) {
      return errorHandlers.apiErrorResponse('Category ID is required', 400);
    }
    
    // Find and delete the category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return errorHandlers.apiErrorResponse('Category not found', 404);
    }
    
    logger.info('Category deleted', { categoryId });
    
    return NextResponse.json({ 
      message: 'Category deleted successfully',
      categoryId
    });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Error deleting category', error);
    return errorHandlers.apiErrorResponse('Failed to delete category');
  }
}