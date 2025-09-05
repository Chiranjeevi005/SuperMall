import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Try to fetch orders to test the connection
    const orders = await Order.find({}).limit(1);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      orderCount: orders.length
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Database connection failed'
    }, { status: 500 });
  }
}