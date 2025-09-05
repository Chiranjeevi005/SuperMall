import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import logger from '@/utils/logger';

// This endpoint will update existing categories with new data
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get the request body
    const body = await request.json();
    
    // Update categories based on the provided data
    const results = [];
    for (const categoryData of body.categories || []) {
      // Find and update the category
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryData._id,
        categoryData,
        { new: true, runValidators: true }
      );
      
      if (updatedCategory) {
        results.push({
          name: updatedCategory.name,
          id: updatedCategory._id,
          status: 'updated'
        });
      } else {
        results.push({
          name: categoryData.name || 'Unknown',
          id: categoryData._id || 'Unknown',
          status: 'not found'
        });
      }
    }

    logger.info('Categories updated', { results });
    
    return NextResponse.json({
      message: 'Categories updated successfully',
      results
    });
  } catch (error: unknown) {
    logger.error('Error updating categories', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Something went wrong while updating categories' },
      { status: 500 }
    );
  }
}