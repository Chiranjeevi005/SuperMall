const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';

console.log('Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Get the Order model
  const Order = mongoose.model('Order', new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    // Add other fields as needed
  }));
  
  try {
    // Drop the orders collection
    console.log('Dropping orders collection...');
    await mongoose.connection.db.dropCollection('orders');
    console.log('Orders collection dropped successfully');
    
    // Recreate the collection with proper indexes
    console.log('Recreating orders collection...');
    await Order.createCollection();
    
    // Create indexes
    await Order.createIndexes();
    console.log('Orders collection recreated with indexes');
    
    console.log('Reset completed successfully');
  } catch (error) {
    console.error('Error resetting orders collection:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});