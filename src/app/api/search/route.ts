import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product, { IProduct } from '@/models/Product';
import Category, { ICategory } from '@/models/Category';
import Vendor, { IVendor } from '@/models/Vendor';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');
    
    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }
    
    // Search for products
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
    .limit(limit)
    .select('name category')
    .lean<IProduct[]>();

    // Search for categories
    const categories = await Category.find({
      name: { $regex: query, $options: 'i' },
      isActive: true
    })
    .limit(limit)
    .select('name')
    .lean<ICategory[]>();

    // Search for vendors/shops
    const vendors = await Vendor.find({
      $or: [
        { shopName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
    .limit(limit)
    .select('shopName category')
    .lean<IVendor[]>();

    // Format suggestions
    const suggestions = [
      ...products.map((product) => ({
        id: (product._id as any).toString(),
        name: product.name,
        type: 'product' as const,
        category: product.category,
        url: `/products/${(product._id as any).toString()}`
      })),
      ...categories.map((category) => ({
        id: (category._id as any).toString(),
        name: category.name,
        type: 'category' as const,
        url: `/categories/${(category._id as any).toString()}`
      })),
      ...vendors.map((vendor) => ({
        id: (vendor._id as any).toString(),
        name: vendor.shopName,
        type: 'shop' as const,
        category: vendor.category,
        url: `/vendors/${(vendor._id as any).toString()}`
      }))
    ].slice(0, limit);
    
    // Log the search
    logger.info('Search suggestions fetched', { query, suggestionCount: suggestions.length });
    
    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    logger.error('Error fetching search suggestions', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Something went wrong while fetching search suggestions' },
      { status: 500 }
    );
  }
}