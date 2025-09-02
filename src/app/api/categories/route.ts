import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    // Build filter object
    const filter: any = {};
    
    if (activeOnly) {
      filter.isActive = true;
    }
    
    // Fetch categories with pagination
    const categories = await Category.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Category.countDocuments(filter);
    
    // Log the request
    logger.info('Categories fetched', { page, limit, activeOnly, total });
    
    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching categories', { error: error.message });
    return NextResponse.json(
      { error: 'Something went wrong while fetching categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // In a real application, you would authenticate the user here
    // For now, we'll assume the user is authenticated and has admin role
    
    const body = await request.json();
    const { name, description, icon } = body;
    
    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }
    
    // Check if category with this name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }
    
    // Create new category
    const category = new Category({
      name,
      description,
      icon,
    });
    
    await category.save();
    
    // Log the creation
    logger.info('Category created', { categoryId: category._id, name: category.name });
    
    return NextResponse.json({
      message: 'Category created successfully',
      category,
    });
  } catch (error: any) {
    logger.error('Error creating category', { error: error.message });
    return NextResponse.json(
      { error: 'Something went wrong while creating category' },
      { status: 500 }
    );
  }
}