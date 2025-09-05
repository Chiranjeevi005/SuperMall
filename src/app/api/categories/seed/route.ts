import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import logger from '@/utils/logger';

// This endpoint will seed the database with Indian-themed categories
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Log the request for debugging purposes
    logger.info('Seeding categories', { url: request.url });
    
    // Define Indian-themed categories
    const indianCategories = [
      {
        name: "Handloom & Textiles",
        description: "Traditional handwoven fabrics, sarees, and textile products from Indian artisans",
        icon: "M4 6h16M4 10h16M4 14h16M4 18h16"
      },
      {
        name: "Jewelry & Accessories",
        description: "Handcrafted jewelry, accessories, and traditional ornaments from Indian craftspeople",
        icon: "M7 11l5-5m0 0l5 5m-5-5v12m0-15a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h6z"
      },
      {
        name: "Ayurvedic Products",
        description: "Natural ayurvedic medicines, herbal products, and wellness items",
        icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
      },
      {
        name: "Traditional Arts",
        description: "Paintings, sculptures, and traditional art forms from Indian artists",
        icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      },
      {
        name: "Organic & Natural",
        description: "Organic products, natural cosmetics, and eco-friendly items",
        icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
      },
      {
        name: "Panchakarma & Wellness",
        description: "Traditional panchakarma treatments, wellness therapies, and holistic health services",
        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      },
      {
        name: "Indian Sweets & Desserts",
        description: "Traditional Indian sweets, desserts, and festive delicacies",
        icon: "M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
      },
      {
        name: "Handmade Pottery & Ceramics",
        description: "Traditional clay pottery, ceramic items, and earthenware from Indian artisans",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      },
      {
        name: "Regional Snacks & Namkeen",
        description: "Authentic regional snacks, namkeen, and traditional munchies from across India",
        icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      },
      {
        name: "Traditional Musical Instruments",
        description: "Indian classical and folk musical instruments from skilled craftsmen",
        icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      }
    ];

    // Create categories that don't already exist
    const results = [];
    for (const categoryData of indianCategories) {
      // Check if category already exists
      const existingCategory = await Category.findOne({ name: categoryData.name });
      
      if (!existingCategory) {
        const category = new Category(categoryData);
        await category.save();
        results.push({
          name: category.name,
          id: category._id,
          status: 'created'
        });
      } else {
        results.push({
          name: categoryData.name,
          id: existingCategory._id,
          status: 'already exists'
        });
      }
    }

    logger.info('Indian-themed categories seeded', { results });
    
    return NextResponse.json({
      message: 'Indian-themed categories seeded successfully',
      results
    });
  } catch (error: unknown) {
    logger.error('Error seeding categories', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Something went wrong while seeding categories' },
      { status: 500 }
    );
  }
}