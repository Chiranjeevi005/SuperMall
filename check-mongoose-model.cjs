// Script to check the Mongoose model for hidden validators

const mongoose = require('mongoose');

// Connect to MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';

async function checkMongooseModel() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    
    // Import the Order model
    const Order = require('./src/models/Order.ts');
    
    console.log('📋 Order Model Info:');
    console.log('  Model name:', Order.modelName);
    console.log('  Collection name:', Order.collection.name);
    
    // Check schema
    const schema = Order.schema;
    console.log('\n📋 Schema Info:');
    console.log('  Paths:', Object.keys(schema.paths));
    
    // Check for validators
    console.log('\n📋 Validators:');
    for (const path in schema.paths) {
      const pathObj = schema.paths[path];
      if (pathObj.validators && pathObj.validators.length > 0) {
        console.log(`  ${path}:`, pathObj.validators);
      }
    }
    
    // Check indexes
    console.log('\n📋 Schema Indexes:');
    console.log(schema._indexes);
    
    // Check for any hidden fields
    console.log('\n📋 Schema Options:');
    console.log(schema.options);
    
    // Check for pre/post hooks
    console.log('\n📋 Pre Hooks:');
    console.log(Order.schema._preMiddleware);
    
    console.log('\n📋 Post Hooks:');
    console.log(Order.schema._postMiddleware);
    
    // Try to create a test order through Mongoose
    console.log('\n📝 Testing Mongoose order creation...');
    const testOrder = new Order({
      orderId: `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      customer: '65f1a0b1c2d3e4f5a6b7c8d9',
      vendor: '65f1a0b1c2d3e4f5a6b7c8e0',
      items: [
        { 
          product: '68ba605120021939d52e142c', 
          quantity: 1, 
          price: 2900 
        }
      ],
      totalAmount: 2900,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      notes: 'Mongoose test order'
    });
    
    try {
      const savedOrder = await testOrder.save();
      console.log('✅ Order created successfully through Mongoose!');
      console.log('📋 Order ID:', savedOrder._id);
      console.log('📋 Order orderId:', savedOrder.orderId);
      
      // Check if orderNumber field exists
      if (savedOrder.orderNumber !== undefined) {
        console.log('⚠️  Found orderNumber field:', savedOrder.orderNumber);
      } else {
        console.log('✅ No orderNumber field found');
      }
      
      // Clean up
      await Order.deleteOne({ _id: savedOrder._id });
      console.log('✅ Test order cleaned up');
      
    } catch (error) {
      console.error('❌ Mongoose order creation failed:', error);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      if (error.keyPattern) {
        console.error('Key pattern:', JSON.stringify(error.keyPattern));
      }
      if (error.keyValue) {
        console.error('Key value:', JSON.stringify(error.keyValue));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkMongooseModel();