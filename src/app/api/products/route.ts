import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const shopId = searchParams.get('shop');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    // Build filter object
    const filter: any = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (shopId) {
      filter.shop = shopId;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Fetch products with pagination
    const products = await Product.find(filter)
      .populate('shop', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    // Log the request
    logger.info('Products fetched', { page, limit, category, shopId, total });
    
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching products', { error: error.message });
    return NextResponse.json(
      { error: 'Something went wrong while fetching products' },
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
    const { name, description, price, shop, category, images, stock, features } = body;
    
    // Validate required fields
    if (!name || !description || !price || !shop || !category || stock === undefined) {
      return NextResponse.json(
        { error: 'Name, description, price, shop, category, and stock are required' },
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
    
    // Create new product
    const product = new Product({
      name,
      description,
      price,
      shop,
      category,
      images,
      stock,
      features,
    });
    
    await product.save();
    
    // Populate shop details
    await product.populate('shop', 'name');
    
    // Log the creation
    logger.info('Product created', { productId: product._id, name: product.name });
    
    return NextResponse.json({
      message: 'Product created successfully',
      product,
    });
  } catch (error: any) {
    logger.error('Error creating product', { error: error.message });
    return NextResponse.json(
      { error: 'Something went wrong while creating product' },
      { status: 500 }
    );
  }
}