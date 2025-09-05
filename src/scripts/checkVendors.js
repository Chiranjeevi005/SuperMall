import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../../.env.local') });

// Define the Vendor schema
const vendorSchema = new mongoose.Schema({
  shopName: String,
  category: String,
  isActive: { type: Boolean, default: true }
});

const Vendor = mongoose.model('Vendor', vendorSchema);

const checkVendors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall');
    console.log('Connected to MongoDB');
    
    const vendorCount = await Vendor.countDocuments();
    console.log(`Total vendors in database: ${vendorCount}`);
    
    const activeVendors = await Vendor.find({ isActive: true });
    console.log(`Active vendors: ${activeVendors.length}`);
    
    console.log('\nActive vendors list:');
    activeVendors.forEach((vendor, index) => {
      console.log(`${index + 1}. ${vendor.shopName} - ${vendor.category}`);
    });
    
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

checkVendors();
