// Script to try to reproduce the exact duplicate key error

const { MongoClient } = require('mongodb');

async function reproduceDuplicateError() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // Check current indexes
    const indexes = await collection.indexes();
    console.log('📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
      if (index.unique) {
        console.log(`    ⚠️  UNIQUE INDEX`);
      }
    });
    
    // Try to create multiple documents with orderNumber: null
    console.log('\n📝 Creating multiple documents with orderNumber: null...');
    
    for (let i = 0; i < 5; i++) {
      const testDoc = {
        orderId: `TEST-${Date.now()}-${i}`,
        orderNumber: null, // This should trigger the error if there's a unique index
        customer: 'test-customer',
        vendor: 'test-vendor',
        items: [],
        totalAmount: 0,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cod'
      };
      
      try {
        const result = await collection.insertOne(testDoc);
        console.log(`✅ Document ${i+1} inserted successfully`);
        console.log(`  📋 Document ID: ${result.insertedId}`);
      } catch (error) {
        console.error(`❌ Document ${i+1} insertion failed:`, error.message);
        console.error(`  Error code: ${error.code}`);
        if (error.keyPattern) {
          console.error(`  Key pattern: ${JSON.stringify(error.keyPattern)}`);
        }
        if (error.keyValue) {
          console.error(`  Key value: ${JSON.stringify(error.keyValue)}`);
        }
        break; // Stop on first error
      }
    }
    
    // Clean up all test documents
    console.log('\n🧹 Cleaning up test documents...');
    const deleteResult = await collection.deleteMany({ 
      orderId: { $regex: /^TEST-\d+-\d+$/ } 
    });
    console.log(`  ✅ Deleted ${deleteResult.deletedCount} test documents`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

reproduceDuplicateError();