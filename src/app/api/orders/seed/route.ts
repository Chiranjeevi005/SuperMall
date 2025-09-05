import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';
import logger from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if orders already exist
    const existingOrders = await Order.countDocuments();
    if (existingOrders > 0) {
      return NextResponse.json({ message: 'Orders already seeded' });
    }
    
    // Get some sample customers and vendors
    const customers = await User.find({ role: 'customer' }).limit(5);
    const vendors = await User.find({ role: 'merchant' }).limit(5);
    
    if (customers.length === 0 || vendors.length === 0) {
      return NextResponse.json({ error: 'Need customers and vendors to seed orders' }, { status: 400 });
    }
    
    // Create sample orders
    const orders = [
      {
        orderId: 'ORD-001',
        customer: customers[0]._id,
        vendor: vendors[0]._id,
        items: [
          {
            product: new mongoose.Types.ObjectId(),
            quantity: 2,
            price: 120,
          },
          {
            product: new mongoose.Types.ObjectId(),
            quantity: 1,
            price: 850,
          },
        ],
        totalAmount: 2450,
        status: 'delivered',
        shippingAddress: {
          street: '123 Main St',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500001',
          country: 'India',
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'completed',
      },
      {
        orderId: 'ORD-002',
        customer: customers[1]._id,
        vendor: vendors[1]._id,
        items: [
          {
            product: new mongoose.Types.ObjectId(),
            quantity: 10,
            price: 60,
          },
          {
            product: new mongoose.Types.ObjectId(),
            quantity: 2,
            price: 250,
          },
        ],
        totalAmount: 1890,
        status: 'shipped',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India',
        },
        paymentMethod: 'PayPal',
        paymentStatus: 'completed',
      },
      {
        orderId: 'ORD-003',
        customer: customers[2]._id,
        vendor: vendors[2]._id,
        items: [
          {
            product: new mongoose.Types.ObjectId(),
            quantity: 1,
            price: 450,
          },
          {
            product: new mongoose.Types.ObjectId(),
            quantity: 3,
            price: 180,
          },
        ],
        totalAmount: 3200,
        status: 'processing',
        shippingAddress: {
          street: '789 Pine Rd',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600001',
          country: 'India',
        },
        paymentMethod: 'Debit Card',
        paymentStatus: 'pending',
      },
    ];
    
    await Order.insertMany(orders);
    
    logger.info('Orders seeded successfully');
    
    return NextResponse.json({ message: 'Orders seeded successfully' });
  } catch (error: unknown) {
    logger.error('Error seeding orders', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Failed to seed orders' }, { status: 500 });
  }
}