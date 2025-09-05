import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import logger from '@/utils/logger';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    // Find and update product to approve it
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: { isApproved: true } },
      { new: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Log the approval
    logger.info('Product approved', { productId: id });
    
    return NextResponse.json({
      message: 'Product approved successfully',
      product,
    });
  } catch (error: unknown) {
    logger.error('Error approving product', { error: error instanceof Error ? error.message : 'Unknown error', productId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while approving product' },
      { status: 500 }
    );
  }
}