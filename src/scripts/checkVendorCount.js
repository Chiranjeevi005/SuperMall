import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../../.env.local') });

// Define the Vendor schema
const vendorSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
  },
  logoURL: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  contact: {
    phone: String,
    email: String,
    address: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Vendor = mongoose.model('Vendor', vendorSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const checkVendorCount = async () => {
  try {
    await connectDB();
    
    const count = await Vendor.countDocuments({ isActive: true });
    console.log(`Total active vendors: ${count}`);
    
    const vendors = await Vendor.find({ isActive: true });
    console.log('Vendors:');
    vendors.forEach(vendor => {
      console.log(`- ${vendor.shopName} (${vendor.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking vendor count:', error);
    process.exit(1);
  }
};

checkVendorCount();