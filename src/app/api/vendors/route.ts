import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vendor from '@/models/Vendor';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '0'); // 0 means no limit
    const category = searchParams.get('category');
    const floor = searchParams.get('floor');
    const minRating = searchParams.get('minRating');
    
    // Build filter object
    const filter: Record<string, unknown> = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (floor) {
      filter.floor = parseInt(floor);
    }
    
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    let vendors;
    let total;
    
    if (limit > 0) {
      // Fetch vendors with pagination
      vendors = await Vendor.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ rating: -1, createdAt: -1 });
      
      // Get total count for pagination
      total = await Vendor.countDocuments(filter);
    } else {
      // Fetch all vendors without pagination
      vendors = await Vendor.find(filter)
        .sort({ rating: -1, createdAt: -1 });
      
      // Total is the same as the number of vendors when no limit is applied
      total = vendors.length;
    }
    
    // Log the request
    logger.info('Vendors fetched', { page, limit, category, floor, minRating, total: vendors.length });
    
    return NextResponse.json({
      vendors,
      ...(limit > 0 ? {
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        }
      } : {
        total: vendors.length
      })
    });
  } catch (error: unknown) {
    logger.error('Error fetching vendors', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Something went wrong while fetching vendors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { shopName, ownerName, category, floor, logoURL, rating, description, contact } = body;
    
    // Validate required fields
    if (!shopName || !ownerName || !category || !floor || !description) {
      return NextResponse.json(
        { error: 'Shop name, owner name, category, floor, and description are required' },
        { status: 400 }
      );
    }
    
    // Create new vendor
    const vendor = new Vendor({
      shopName,
      ownerName,
      category,
      floor,
      logoURL,
      rating,
      description,
      contact,
    });
    
    await vendor.save();
    
    // Log the creation
    logger.info('Vendor created', { vendorId: vendor._id, shopName: vendor.shopName });
    
    return NextResponse.json({
      message: 'Vendor created successfully',
      vendor,
    });
  } catch (error: unknown) {
    logger.error('Error creating vendor', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Something went wrong while creating vendor' },
      { status: 500 }
    );
  }
}