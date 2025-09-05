// Complete script to fix all order-related issues

const { MongoClient } = require('mongodb');

// Function to generate a unique order ID
function generateOrderId() {
  // Use timestamp + random component for uniqueness
  const timestamp = Date.now().toString();
  const randomComponent = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORDER-${timestamp}-${randomComponent}`;
}

async function completeOrdersFix() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    console.log('\n--- STEP 1: Checking current state ---');
    
    // Check current indexes
    let indexes = await collection.indexes();
    console.log('📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check for problematic documents
    const nullOrderIdDocs = await collection.find({ orderId: null }).toArray();
    const missingOrderIdDocs = await collection.find({ orderId: { $exists: false } }).toArray();
    const orderNumberDocs = await collection.find({ orderNumber: { $exists: true } }).toArray();
    
    console.log(`\n🔍 Documents with null orderId: ${nullOrderIdDocs.length}`);
    console.log(`🔍 Documents missing orderId field: ${missingOrderIdDocs.length}`);
    console.log(`🔍 Documents with orderNumber field: ${orderNumberDocs.length}`);
    
    console.log('\n--- STEP 2: Fixing documents with null/missing orderId ---');
    
    // Fix documents with null orderId
    if (nullOrderIdDocs.length > 0) {
      console.log('🔧 Fixing documents with null orderId...');
      for (const doc of nullOrderIdDocs) {
        const newOrderId = generateOrderId();
        await collection.updateOne(
          { _id: doc._id },
          { $set: { orderId: newOrderId } }
        );
        console.log(`  ✅ Updated document ${doc._id} with orderId: ${newOrderId}`);
      }
    }
    
    // Fix documents missing orderId field
    if (missingOrderIdDocs.length > 0) {
      console.log('🔧 Fixing documents missing orderId field...');
      for (const doc of missingOrderIdDocs) {
        const newOrderId = generateOrderId();
        await collection.updateOne(
          { _id: doc._id },
          { $set: { orderId: newOrderId } }
        );
        console.log(`  ✅ Updated document ${doc._id} with orderId: ${newOrderId}`);
      }
    }
    
    console.log('\n--- STEP 3: Removing orderNumber field from all documents ---');
    
    // Remove orderNumber field
    if (orderNumberDocs.length > 0) {
      console.log('🗑️  Removing orderNumber field from all documents...');
      const result = await collection.updateMany(
        { orderNumber: { $exists: true } },
        { $unset: { orderNumber: "" } }
      );
      console.log(`  ✅ Removed orderNumber field from ${result.modifiedCount} documents`);
    } else {
      console.log('✅ No documents with orderNumber field found');
    }
    
    console.log('\n--- STEP 4: Resetting indexes ---');
    
    // Drop all indexes except _id_
    for (const index of indexes) {
      if (index.name !== '_id_') {
        console.log(`🗑️  Dropping index: ${index.name}`);
        await collection.dropIndex(index.name);
        console.log(`  ✅ Dropped ${index.name}`);
      }
    }
    
    // Create required indexes
    console.log('➕ Creating required indexes...');
    
    await collection.createIndex({ orderId: 1 }, { unique: true });
    console.log('  ✅ Created unique index on orderId');
    
    await collection.createIndex({ customer: 1, status: 1 });
    console.log('  ✅ Created index on customer and status');
    
    await collection.createIndex({ paymentIntentId: 1 });
    console.log('  ✅ Created index on paymentIntentId');
    
    console.log('\n--- STEP 5: Final verification ---');
    
    // Final verification
    indexes = await collection.indexes();
    console.log('📋 Final indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    const finalNullOrderIdDocs = await collection.find({ orderId: null }).toArray();
    const finalMissingOrderIdDocs = await collection.find({ orderId: { $exists: false } }).toArray();
    const finalOrderNumberDocs = await collection.find({ orderNumber: { $exists: true } }).toArray();
    
    console.log(`\n🔍 Final documents with null orderId: ${finalNullOrderIdDocs.length}`);
    console.log(`🔍 Final documents missing orderId field: ${finalMissingOrderIdDocs.length}`);
    console.log(`🔍 Final documents with orderNumber field: ${finalOrderNumberDocs.length}`);
    
    // Overall status
    if (finalNullOrderIdDocs.length === 0 && finalMissingOrderIdDocs.length === 0) {
      console.log('\n🎉 SUCCESS: All documents have valid orderId values');
    } else {
      console.log('\n❌ ISSUE: Some documents still have invalid orderId values');
    }
    
    if (finalOrderNumberDocs.length === 0) {
      console.log('🎉 SUCCESS: No documents have orderNumber field');
    } else {
      console.log('❌ ISSUE: Some documents still have orderNumber field');
    }
    
    const orderIdIndex = indexes.find(index => index.name === 'orderId_1');
    const customerStatusIndex = indexes.find(index => index.name === 'customer_1_status_1');
    const paymentIntentIndex = indexes.find(index => index.name === 'paymentIntentId_1');
    
    if (orderIdIndex && orderIdIndex.unique) {
      console.log('🎉 SUCCESS: Unique index on orderId exists');
    } else {
      console.log('❌ ISSUE: Unique index on orderId missing or not unique');
    }
    
    if (customerStatusIndex) {
      console.log('🎉 SUCCESS: Index on customer and status exists');
    } else {
      console.log('❌ ISSUE: Index on customer and status missing');
    }
    
    if (paymentIntentIndex) {
      console.log('🎉 SUCCESS: Index on paymentIntentId exists');
    } else {
      console.log('❌ ISSUE: Index on paymentIntentId missing');
    }
    
    console.log('\n📊 Summary:');
    console.log(`  Total orders: ${await collection.countDocuments()}`);
    console.log(`  Orders with valid orderId: ${await collection.countDocuments({ orderId: { $ne: null, $exists: true } })}`);
    
    console.log('\n🎊 COMPLETE: All order-related issues have been fixed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

completeOrdersFix();