import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import logger from '@/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    // Find category by ID
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Log the request
    logger.info('Category fetched', { categoryId: id });
    
    return NextResponse.json({ category });
  } catch (error: any) {
    logger.error('Error fetching category', { error: error.message, categoryId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while fetching category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Find and update category
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Log the update
    logger.info('Category updated', { categoryId: id });
    
    return NextResponse.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error: any) {
    logger.error('Error updating category', { error: error.message, categoryId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while updating category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    // Find and delete category
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Log the deletion
    logger.info('Category deleted', { categoryId: id });
    
    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error deleting category', { error: error.message, categoryId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while deleting category' },
      { status: 500 }
    );
  }
}