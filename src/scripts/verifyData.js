import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('❌ Database connection error:', err);
    return false;
  }
};

// Verify data
const verifyData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      process.exit(1);
    }
    
    // Get collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== Database Collections ===');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Count documents in each collection
    console.log('\n=== Document Counts ===');
    for (const collection of collections) {
      if (collection.name === 'categories' || collection.name === 'vendors' || collection.name === 'products') {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        console.log(`${collection.name}: ${count}`);
      }
    }
    
    // Show sample data from key collections
    console.log('\n=== Sample Data ===');
    
    // Categories
    const categories = await mongoose.connection.db.collection('categories').find().limit(3).toArray();
    console.log('\n--- Categories ---');
    categories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.description}`);
    });
    
    // Vendors
    const vendors = await mongoose.connection.db.collection('vendors').find().limit(3).toArray();
    console.log('\n--- Vendors ---');
    vendors.forEach(vendor => {
      console.log(`- ${vendor.shopName} (Floor ${vendor.floor}, Rating: ${vendor.rating})`);
    });
    
    // Products
    const products = await mongoose.connection.db.collection('products').find().limit(3).toArray();
    console.log('\n--- Products ---');
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category}): ₹${product.price}`);
    });
    
    console.log('\n✅ Data verification completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

verifyData();