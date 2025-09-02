import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Offer from '@/models/Offer';
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
        { error: 'Invalid offer ID' },
        { status: 400 }
      );
    }
    
    // Find offer by ID
    const offer = await Offer.findById(id).populate('shop', 'name');
    
    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }
    
    // Log the request
    logger.info('Offer fetched', { offerId: id });
    
    return NextResponse.json({ offer });
  } catch (error: any) {
    logger.error('Error fetching offer', { error: error.message, offerId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while fetching offer' },
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
        { error: 'Invalid offer ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Find and update offer
    const offer = await Offer.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('shop', 'name');
    
    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }
    
    // Log the update
    logger.info('Offer updated', { offerId: id });
    
    return NextResponse.json({
      message: 'Offer updated successfully',
      offer,
    });
  } catch (error: any) {
    logger.error('Error updating offer', { error: error.message, offerId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while updating offer' },
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
        { error: 'Invalid offer ID' },
        { status: 400 }
      );
    }
    
    // Find and delete offer
    const offer = await Offer.findByIdAndDelete(id);
    
    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }
    
    // Log the deletion
    logger.info('Offer deleted', { offerId: id });
    
    return NextResponse.json({
      message: 'Offer deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error deleting offer', { error: error.message, offerId: params.id });
    return NextResponse.json(
      { error: 'Something went wrong while deleting offer' },
      { status: 500 }
    );
  }
}