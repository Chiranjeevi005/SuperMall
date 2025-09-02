import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Offer from '@/models/Offer';
import Shop from '@/models/Shop';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const shopId = searchParams.get('shop');
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    // Build filter object
    const filter: any = {};
    
    if (shopId) {
      filter.shop = shopId;
    }
    
    if (activeOnly) {
      filter.isActive = true;
      filter.startDate = { $lte: new Date() };
      filter.endDate = { $gte: new Date() };
    }
    
    // Fetch offers with pagination
    const offers = await Offer.find(filter)
      .populate('shop', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Offer.countDocuments(filter);
    
    // Log the request
    logger.info('Offers fetched', { page, limit, shopId, activeOnly, total });
    
    return NextResponse.json({
      offers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching offers', { error: error.message });
    return NextResponse.json(
      { error: 'Something went wrong while fetching offers' },
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
    const { title, description, discountType, discountValue, startDate, endDate, shop, products } = body;
    
    // Validate required fields
    if (!title || !description || !discountType || !discountValue || !startDate || !endDate || !shop) {
      return NextResponse.json(
        { error: 'Title, description, discountType, discountValue, startDate, endDate, and shop are required' },
        { status: 400 }
      );
    }
    
    // Check if shop exists
    const shopDoc = await Shop.findById(shop);
    if (!shopDoc) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }
    
    // Create new offer
    const offer = new Offer({
      title,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      shop,
      products,
    });
    
    await offer.save();
    
    // Populate shop details
    await offer.populate('shop', 'name');
    
    // Log the creation
    logger.info('Offer created', { offerId: offer._id, title: offer.title });
    
    return NextResponse.json({
      message: 'Offer created successfully',
      offer,
    });
  } catch (error: any) {
    logger.error('Error creating offer', { error: error.message });
    return NextResponse.json(
      { error: 'Something went wrong while creating offer' },
      { status: 500 }
    );
  }
}