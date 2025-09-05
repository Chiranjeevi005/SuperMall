import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../../.env.local') });

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
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

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
    
    // Get count of all categories
    const totalCount = await Category.countDocuments();
    console.log('Total categories in database:', totalCount);
    
    // Get count of active categories
    const activeCount = await Category.countDocuments({ isActive: true });
    console.log('Active categories:', activeCount);
    
    // Get count of inactive categories
    const inactiveCount = await Category.countDocuments({ isActive: false });
    console.log('Inactive categories:', inactiveCount);
    
    // Get all categories with their isActive status
    const categories = await Category.find({}, 'name isActive');
    console.log('Categories:');
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (Active: ${category.isActive})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking categories:', error);
    process.exit(1);
  }
};

checkCategories();