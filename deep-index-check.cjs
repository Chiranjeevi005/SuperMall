// Deep index check to find any problematic index

const { MongoClient } = require('mongodb');

async function deepIndexCheck() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('📋 All collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check each collection for any index that might cause issues
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n--- Deep checking collection: ${collectionName} ---`);
      
      try {
        const collection = db.collection(collectionName);
        
        // Get all indexes
        const indexes = await collection.indexes();
        console.log(`  📋 Found ${indexes.length} indexes:`);
        
        for (const index of indexes) {
          console.log(`    - ${index.name}: ${JSON.stringify(index.key)}`);
          
          // Check if this is a unique index
          if (index.unique) {
            console.log(`      ⚠️  UNIQUE INDEX`);
          }
          
          // Check if any key contains 'orderNumber'
          const keyFields = Object.keys(index.key);
          for (const keyField of keyFields) {
            if (keyField.toLowerCase().includes('ordernumber')) {
              console.log(`      ⚠️  CONTAINS ORDERNUMBER: ${keyField}`);
            }
          }
        }
        
        // Try to create a test document to see if there are any validators
        const testDoc = {
          testField: 'testValue',
          timestamp: new Date()
        };
        
        try {
          // Try inserting a simple test document
          const result = await collection.insertOne(testDoc);
          console.log(`  ✅ Test document inserted successfully`);
          
          // Clean up
          await collection.deleteOne({ _id: result.insertedId });
          console.log(`  🧹 Test document cleaned up`);
        } catch (insertError) {
          console.log(`  ❌ Test document insertion failed:`, insertError.message);
          if (insertError.code === 11000) {
            console.log(`      ⚠️  DUPLICATE KEY ERROR!`);
            console.log(`      Key pattern:`, JSON.stringify(insertError.keyPattern));
            console.log(`      Key value:`, JSON.stringify(insertError.keyValue));
          }
        }
        
      } catch (error) {
        console.log(`  ❌ Error checking collection ${collectionName}:`, error.message);
      }
    }
    
    // Specifically check the orders collection
    console.log('\n--- Detailed orders collection check ---');
    const ordersCollection = db.collection('orders');
    
    // Check for any document that might have orderNumber
    const sampleDoc = await ordersCollection.findOne({ orderNumber: { $exists: true } });
    if (sampleDoc) {
      console.log('  ⚠️  Found document with orderNumber:');
      console.log('    _id:', sampleDoc._id);
      console.log('    orderNumber:', sampleDoc.orderNumber);
      console.log('    orderId:', sampleDoc.orderId);
    } else {
      console.log('  ✅ No documents with orderNumber found');
    }
    
    // Check collection stats
    try {
      const stats = await ordersCollection.stats();
      console.log('\n  📊 Orders collection stats:');
      console.log('    Size:', stats.size);
      console.log('    Count:', stats.count);
      console.log('    Avg obj size:', stats.avgObjSize);
    } catch (statsError) {
      console.log('  ❌ Could not get collection stats:', statsError.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

deepIndexCheck();