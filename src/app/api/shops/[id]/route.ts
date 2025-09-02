import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Shop from '@/models/Shop';
import logger from '@/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }
    
    // Find shop by ID
    const shop = await Shop.findById(id).populate('owner', 'name email');
    
    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }
    
    // Log the request
    logger.info('Shop fetched', { shopId: id });
    
    return NextResponse.json({ shop });
  } catch (error: any) {
    logger.error('Error fetching shop', { error: error.message, shopId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while fetching shop' },
      { status: 500 }
    );
  }
}

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
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Find and update shop
    const shop = await Shop.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('owner', 'name email');
    
    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }
    
    // Log the update
    logger.info('Shop updated', { shopId: id });
    
    return NextResponse.json({
      message: 'Shop updated successfully',
      shop,
    });
  } catch (error: any) {
    logger.error('Error updating shop', { error: error.message, shopId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while updating shop' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }
    
    // Find and delete shop
    const shop = await Shop.findByIdAndDelete(id);
    
    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }
    
    // Log the deletion
    logger.info('Shop deleted', { shopId: id });
    
    return NextResponse.json({
      message: 'Shop deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error deleting shop', { error: error.message, shopId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while deleting shop' },
      { status: 500 }
    );
  }
}