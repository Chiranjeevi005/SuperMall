// Script to check the exact database and collection that the application is using

// This script will simulate what the application does
const mongoose = require('mongoose');

// Set the MONGODB_URI to match what the application uses
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';

async function checkAppDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB with Mongoose...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('📋 Database name:', mongoose.connection.db.databaseName);
    
    // Try to create a test document directly with the collection
    const collection = mongoose.connection.collection('orders');
    
    // Check indexes
    console.log('\n📋 Collection indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
      if (index.unique) {
        console.log(`    ⚠️  UNIQUE INDEX`);
      }
    });
    
    // Check for documents with orderNumber
    console.log('\n📋 Checking for documents with orderNumber field...');
    const docs = await collection.find({ orderNumber: { $exists: true } }).toArray();
    console.log(`  Found ${docs.length} documents with orderNumber field`);
    
    if (docs.length > 0) {
      console.log('  Sample documents:');
      docs.slice(0, 3).forEach(doc => {
        console.log(`    - _id: ${doc._id}, orderNumber: ${doc.orderNumber}`);
      });
    }
    
    // Try to create a test document
    console.log('\n📝 Creating test document through Mongoose collection...');
    const testDoc = {
      orderId: `TEST-${Date.now()}`,
      customer: '65f1a0b1c2d3e4f5a6b7c8d9',
      vendor: '65f1a0b1c2d3e4f5a6b7c8e0',
      items: [],
      totalAmount: 0,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      shippingAddress: {
        street: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      }
    };
    
    try {
      const result = await collection.insertOne(testDoc);
      console.log('✅ Document saved successfully');
      console.log('  Document ID:', result.insertedId);
      
      // Clean up
      await collection.deleteOne({ _id: result.insertedId });
      console.log('🧹 Document cleaned up');
    } catch (error) {
      console.error('❌ Document save failed:', error.message);
      console.error('  Error code:', error.code);
      if (error.keyPattern) {
        console.error('  Key pattern:', JSON.stringify(error.keyPattern));
      }
      if (error.keyValue) {
        console.error('  Key value:', JSON.stringify(error.keyValue));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkAppDatabase();