import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Vendor from '@/models/Vendor';
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
        { error: 'Invalid vendor ID' },
        { status: 400 }
      );
    }
    
    // Find vendor by ID
    const vendor = await Vendor.findById(id);
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    // Log the request
    logger.info('Vendor fetched', { vendorId: id });
    
    return NextResponse.json({ vendor });
  } catch (error: unknown) {
    logger.error('Error fetching vendor', { error: error instanceof Error ? error.message : 'Unknown error', vendorId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while fetching vendor' },
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
        { error: 'Invalid vendor ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Find and update vendor
    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    // Log the update
    logger.info('Vendor updated', { vendorId: id });
    
    return NextResponse.json({
      message: 'Vendor updated successfully',
      vendor,
    });
  } catch (error: unknown) {
    logger.error('Error updating vendor', { error: error instanceof Error ? error.message : 'Unknown error', vendorId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while updating vendor' },
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
        { error: 'Invalid vendor ID' },
        { status: 400 }
      );
    }
    
    // Find and delete vendor
    const vendor = await Vendor.findByIdAndDelete(id);
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    // Log the deletion
    logger.info('Vendor deleted', { vendorId: id });
    
    return NextResponse.json({
      message: 'Vendor deleted successfully',
    });
  } catch (error: unknown) {
    logger.error('Error deleting vendor', { error: error instanceof Error ? error.message : 'Unknown error', vendorId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while deleting vendor' },
      { status: 500 }
    );
  }
}