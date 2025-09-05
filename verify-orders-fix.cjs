// Script to verify that the orders fix is working correctly

const { MongoClient } = require('mongodb');

async function verifyOrdersFix() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // Check current indexes
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Verify no null orderId values
    const nullOrderIdDocs = await collection.find({ orderId: null }).toArray();
    console.log(`\n🔍 Documents with null orderId: ${nullOrderIdDocs.length}`);
    
    // Verify no missing orderId field
    const missingOrderIdDocs = await collection.find({ orderId: { $exists: false } }).toArray();
    console.log(`🔍 Documents missing orderId field: ${missingOrderIdDocs.length}`);
    
    // Check for orderNumber field (should not exist anymore)
    const orderNumberDocs = await collection.find({ orderNumber: { $exists: true } }).toArray();
    console.log(`🔍 Documents with orderNumber field: ${orderNumberDocs.length}`);
    
    // Overall status
    if (nullOrderIdDocs.length === 0 && missingOrderIdDocs.length === 0) {
      console.log('\n✅ SUCCESS: All documents have valid orderId values');
    } else {
      console.log('\n❌ ISSUE: Some documents still have invalid orderId values');
    }
    
    if (orderNumberDocs.length === 0) {
      console.log('✅ SUCCESS: No documents have orderNumber field');
    } else {
      console.log('❌ ISSUE: Some documents still have orderNumber field');
    }
    
    // Check for the required indexes
    const orderIdIndex = indexes.find(index => index.name === 'orderId_1');
    const customerStatusIndex = indexes.find(index => index.name === 'customer_1_status_1');
    const paymentIntentIndex = indexes.find(index => index.name === 'paymentIntentId_1');
    
    if (orderIdIndex && orderIdIndex.unique) {
      console.log('✅ SUCCESS: Unique index on orderId exists');
    } else {
      console.log('❌ ISSUE: Unique index on orderId missing or not unique');
    }
    
    if (customerStatusIndex) {
      console.log('✅ SUCCESS: Index on customer and status exists');
    } else {
      console.log('❌ ISSUE: Index on customer and status missing');
    }
    
    if (paymentIntentIndex) {
      console.log('✅ SUCCESS: Index on paymentIntentId exists');
    } else {
      console.log('❌ ISSUE: Index on paymentIntentId missing');
    }
    
    console.log('\n📊 Summary:');
    console.log(`  Total orders: ${await collection.countDocuments()}`);
    console.log(`  Orders with valid orderId: ${await collection.countDocuments({ orderId: { $ne: null, $exists: true } })}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

verifyOrdersFix();