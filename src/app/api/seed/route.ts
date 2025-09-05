import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Category from '@/models/Category';
import Vendor from '@/models/Vendor';
import Product from '@/models/Product';
import logger from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if data already exists
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const vendorCount = await Vendor.countDocuments();
    const productCount = await Product.countDocuments();
    
    if (userCount > 0 || categoryCount > 0 || vendorCount > 0 || productCount > 0) {
      return NextResponse.json({ message: 'Database already seeded' });
    }
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@supermall.com',
      password: 'Admin@123',
      role: 'admin',
      contact: '+91 98765 43210',
      isVerified: true,
    });
    
    await adminUser.save();
    
    // Create sample customers
    const customers = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: 'Customer@123',
        role: 'customer',
        contact: '+91 98765 43211',
        isVerified: true,
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'Customer@123',
        role: 'customer',
        contact: '+91 98765 43212',
        isVerified: true,
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: 'Customer@123',
        role: 'customer',
        contact: '+91 98765 43213',
        isVerified: true,
      },
    ];
    
    const customerUsers = await User.insertMany(customers);
    
    // Create sample merchants
    const merchants = [
      {
        name: 'Suresh Reddy',
        email: 'suresh@example.com',
        password: 'Merchant@123',
        role: 'merchant',
        contact: '+91 98765 43214',
        isVerified: true,
      },
      {
        name: 'Meena Devi',
        email: 'meena@example.com',
        password: 'Merchant@123',
        role: 'merchant',
        contact: '+91 98765 43215',
        isVerified: true,
      },
    ];
    
    const merchantUsers = await User.insertMany(merchants);
    
    // Create sample categories
    const categories = [
      {
        name: 'Organic Food',
        description: 'Fresh organic produce and food items',
      },
      {
        name: 'Handicrafts',
        description: 'Traditional handmade crafts and artifacts',
      },
      {
        name: 'Dairy Products',
        description: 'Fresh milk, cheese, butter and other dairy items',
      },
      {
        name: 'Textiles',
        description: 'Traditional fabrics and clothing',
      },
    ];
    
    const categoryDocs = await Category.insertMany(categories);
    
    // Create sample vendors
    const vendors = [
      {
        shopName: 'Farmers Kitchen',
        ownerName: 'Suresh Reddy',
        category: categoryDocs[0]._id,
        floor: 1,
        description: 'Fresh organic produce directly from local farms',
        contact: {
          phone: '+91 98765 43214',
          email: 'suresh@example.com',
          address: '123 Farm Road, Hyderabad',
        },
        isApproved: true,
      },
      {
        shopName: 'Artisan Crafts',
        ownerName: 'Meena Devi',
        category: categoryDocs[1]._id,
        floor: 2,
        description: 'Beautiful handmade crafts from local artisans',
        contact: {
          phone: '+91 98765 43215',
          email: 'meena@example.com',
          address: '456 Craft Street, Hyderabad',
        },
        isApproved: true,
      },
      {
        shopName: 'Dairy Products',
        ownerName: 'Ramesh Kumar',
        category: categoryDocs[2]._id,
        floor: 1,
        description: 'Fresh dairy products from local farms',
        contact: {
          phone: '+91 98765 43216',
          email: 'ramesh@example.com',
          address: '789 Dairy Lane, Hyderabad',
        },
        isApproved: true,
      },
    ];
    
    const vendorDocs = await Vendor.insertMany(vendors);
    
    // Create sample products
    const products = [
      {
        name: 'Organic Brown Rice',
        description: 'Fresh organic brown rice from local farms',
        price: 120,
        shop: vendorDocs[0]._id,
        category: categoryDocs[0].name,
        stock: 50,
        isApproved: true,
      },
      {
        name: 'Handmade Pottery Set',
        description: 'Beautiful handmade pottery set',
        price: 850,
        shop: vendorDocs[1]._id,
        category: categoryDocs[1].name,
        stock: 10,
        isApproved: true,
      },
      {
        name: 'Fresh Farm Milk',
        description: 'Fresh milk from local dairy farms',
        price: 60,
        shop: vendorDocs[2]._id,
        category: categoryDocs[2].name,
        stock: 100,
        isApproved: true,
      },
      {
        name: 'Organic Honey',
        description: 'Pure organic honey from local beekeepers',
        price: 250,
        shop: vendorDocs[0]._id,
        category: categoryDocs[0].name,
        stock: 30,
        isApproved: true,
      },
      {
        name: 'Handwoven Shawl',
        description: 'Beautiful handwoven shawl made by local artisans',
        price: 450,
        shop: vendorDocs[1]._id,
        category: categoryDocs[1].name,
        stock: 15,
        isApproved: true,
      },
      {
        name: 'Organic Turmeric Powder',
        description: 'Pure organic turmeric powder',
        price: 180,
        shop: vendorDocs[0]._id,
        category: categoryDocs[0].name,
        stock: 40,
        isApproved: true,
      },
    ];
    
    await Product.insertMany(products);
    
    logger.info('Database seeded successfully');
    
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error: unknown) {
    logger.error('Error seeding database', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}