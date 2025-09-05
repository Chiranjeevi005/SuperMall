import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
dotenv.config({ path: path.resolve(path.dirname(__filename), '.env.local') });

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Use existing model if it exists, otherwise create new one
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

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

// Function to check categories
const checkCategories = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Get all categories
    const categories = await Category.find({});
    console.log('Categories in database:');
    categories.forEach(category => {
      console.log(`- ${category.name}:`);
      console.log(`  Image: ${category.image}`);
      console.log(`  Icon: ${category.icon}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking categories:', error);
    process.exit(1);
  }
};

checkCategories();