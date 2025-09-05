import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import logger from '@/utils/logger';
import React from 'react';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // In Next.js 15+, params is a Promise and must be awaited
    const { id } = await params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    // Find product by ID
    const product = await Product.findById(id).populate('shop', 'name');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Log the request
    logger.info('Product fetched', { productId: id });
    
    return NextResponse.json({ product });
  } catch (error: unknown) {
    logger.error('Error fetching product', { error: error instanceof Error ? error.message : 'Unknown error', productId: (await params).id });
    return NextResponse.json(
      { error: 'Something went wrong while fetching product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // In Next.js 15+, params is a Promise and must be awaited
    const { id } = await params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Find and update product
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('shop', 'name');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Log the update
    logger.info('Product updated', { productId: id });
    
    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error: unknown) {
    logger.error('Error updating product', { error: error instanceof Error ? error.message : 'Unknown error', productId: (await params).id });
    return NextResponse.json(
      { error: 'Something went wrong while updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // In Next.js 15+, params is a Promise and must be awaited
    const { id } = await params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    // Find and delete product
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Log the deletion
    logger.info('Product deleted', { productId: id });
    
    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error: unknown) {
    logger.error('Error deleting product', { error: error instanceof Error ? error.message : 'Unknown error', productId: (await params).id });
    return NextResponse.json(
      { error: 'Something went wrong while deleting product' },
      { status: 500 }
    );
  }
}