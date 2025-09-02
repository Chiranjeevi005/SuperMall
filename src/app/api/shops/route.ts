import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Shop from '@/models/Shop';
import User from '@/models/User';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const floor = searchParams.get('floor');
    
    // Build filter object
    const filter: any = { isActive: true };
    
    if (category) {
      filter.categories = { $in: [category] };
    }
    
    if (floor) {
      filter['location.floor'] = parseInt(floor);
    }
    
    // Fetch shops with pagination
    const shops = await Shop.find(filter)
      .populate('owner', 'name email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Shop.countDocuments(filter);
    
    // Log the request
    logger.info('Shops fetched', { page, limit, category, floor, total });
    
    return NextResponse.json({
      shops,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching shops', { error: error.message });
    return NextResponse.json(
      { error: 'Something went wrong while fetching shops' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // In a real application, you would authenticate the user here
    // For now, we'll assume the user is authenticated and has merchant/admin role
    
    const body = await request.json();
    const { name, description, owner, location, contact, categories } = body;
    
    // Validate required fields
    if (!name || !description || !owner || !location) {
      return NextResponse.json(
        { error: 'Name, description, owner, and location are required' },
        { status: 400 }
      );
    }
    
    // Check if owner exists
    const user = await User.findById(owner);
    if (!user) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }
    
    // Create new shop
    const shop = new Shop({
      name,
      description,
      owner,
      location,
      contact,
      categories,
    });
    
    await shop.save();
    
    // Populate owner details
    await shop.populate('owner', 'name email');
    
    // Log the creation
    logger.info('Shop created', { shopId: shop._id, name: shop.name });
    
    return NextResponse.json({
      message: 'Shop created successfully',
      shop,
    });
  } catch (error: any) {
    logger.error('Error creating shop', { error: error.message });
    return NextResponse.json(
      { error: 'Something went wrong while creating shop' },
      { status: 500 }
    );
  }
}