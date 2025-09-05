import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Vendor from '@/models/Vendor';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    const connection = await dbConnect();
    
    // Check if we have a real database connection
    if (!connection.connection || connection.connection.readyState !== 1) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        readyState: connection.connection?.readyState || 'No connection'
      });
    }
    
    // Count documents in each collection
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    const vendorCount = await Vendor.countDocuments();
    
    // Get sample data
    const categories = await Category.find().limit(3);
    const products = await Product.find().limit(3);
    const vendors = await Vendor.find().limit(3);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      counts: {
        categories: categoryCount,
        products: productCount,
        vendors: vendorCount
      },
      samples: {
        categories: categories.map(cat => ({
          id: cat._id,
          name: cat.name,
          description: cat.description
        })),
        products: products.map(prod => ({
          id: prod._id,
          name: prod.name,
          price: prod.price,
          category: prod.category
        })),
        vendors: vendors.map(vendor => ({
          id: vendor._id,
          shopName: vendor.shopName,
          category: vendor.category,
          floor: vendor.floor
        }))
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to database',
      error: error.message
    }, { status: 500 });
  }
}