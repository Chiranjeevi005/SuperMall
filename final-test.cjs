// Final test to reproduce the exact error

const { MongoClient } = require('mongodb');

async function finalTest() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // First, let's check if there's any document with orderNumber field
    const docs = await collection.find({ orderNumber: { $exists: true } }).toArray();
    console.log(`📋 Found ${docs.length} documents with orderNumber field`);
    
    if (docs.length > 0) {
      console.log('📋 Sample documents:');
      docs.slice(0, 3).forEach(doc => {
        console.log(`  - _id: ${doc._id}, orderNumber: ${doc.orderNumber}`);
      });
    }
    
    // Let's also check if there's any document with orderNumber: null
    const nullDocs = await collection.find({ orderNumber: null }).toArray();
    console.log(`📋 Found ${nullDocs.length} documents with orderNumber: null`);
    
    // Now, let's try to create a document that might trigger the error
    console.log('\n📝 Creating test document...');
    
    const testDoc = {
      orderId: `TEST-${Date.now()}`,
      orderNumber: null, // This might trigger the error
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
      console.log('✅ Document inserted successfully');
      console.log('📋 Document ID:', result.insertedId);
      
      // Clean up
      await collection.deleteOne({ _id: result.insertedId });
      console.log('🧹 Document cleaned up');
    } catch (error) {
      console.error('❌ Document insertion failed:', error.message);
      console.error('Error code:', error.code);
      if (error.keyPattern) {
        console.error('Key pattern:', JSON.stringify(error.keyPattern));
      }
      if (error.keyValue) {
        console.error('Key value:', JSON.stringify(error.keyValue));
      }
    }
    
    // Let's also try creating a document without orderNumber field
    console.log('\n📝 Creating test document without orderNumber...');
    
    const testDoc2 = {
      orderId: `TEST2-${Date.now()}`,
      customer: 'test-customer',
      vendor: 'test-vendor',
      items: [],
      totalAmount: 0,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cod'
    };
    
    try {
      const result = await collection.insertOne(testDoc2);
      console.log('✅ Document inserted successfully');
      console.log('📋 Document ID:', result.insertedId);
      
      // Clean up
      await collection.deleteOne({ _id: result.insertedId });
      console.log('🧹 Document cleaned up');
    } catch (error) {
      console.error('❌ Document insertion failed:', error.message);
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
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

finalTest();