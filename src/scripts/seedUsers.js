import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env.local first, then fallback to .env
config({ path: path.resolve(__dirname, '../../.env.local') });
config({ path: path.resolve(__dirname, '../../.env') });

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'merchant', 'customer'],
      message: 'Role must be admin, merchant, or customer'
    },
    default: 'customer',
  },
  contact: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Connect to MongoDB and seed users
const seedUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Use existing model or create new one
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Clear existing users
    console.log('Clearing existing users...');
    await User.deleteMany({});
    console.log('Cleared existing users');
    
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
    console.log('✅ Created admin user');
    
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
    
    for (const customer of customers) {
      const user = new User(customer);
      await user.save();
      console.log(`✅ Created customer: ${customer.name}`);
    }
    
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
    
    for (const merchant of merchants) {
      const user = new User(merchant);
      await user.save();
      console.log(`✅ Created merchant: ${merchant.name}`);
    }
    
    console.log('\n🎉 All users seeded successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin:');
    console.log('  Email: admin@supermall.com');
    console.log('  Password: Admin@123');
    console.log('\nCustomers:');
    console.log('  Email: rajesh@example.com, priya@example.com, amit@example.com');
    console.log('  Password: Customer@123');
    console.log('\nMerchants:');
    console.log('  Email: suresh@example.com, meena@example.com');
    console.log('  Password: Merchant@123');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedUsers();