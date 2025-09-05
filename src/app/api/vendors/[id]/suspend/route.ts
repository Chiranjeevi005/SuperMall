import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Vendor from '@/models/Vendor';
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
        { error: 'Invalid vendor ID' },
        { status: 400 }
      );
    }
    
    // Find and update vendor to suspend it
    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: { isSuspended: true, isApproved: false } },
      { new: true }
    );
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    // Log the suspension
    logger.info('Vendor suspended', { vendorId: id });
    
    return NextResponse.json({
      message: 'Vendor suspended successfully',
      vendor,
    });
  } catch (error: unknown) {
    logger.error('Error suspending vendor', { error: error instanceof Error ? error.message : 'Unknown error', vendorId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while suspending vendor' },
      { status: 500 }
    );
  }
}