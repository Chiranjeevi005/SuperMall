// Script to check for system indexes and hidden validators

const { MongoClient } = require('mongodb');

async function systemIndexCheck() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    
    // Check for any system collections
    const collections = await db.listCollections({}, { nameOnly: false }).toArray();
    console.log('📋 All collections (including system):');
    collections.forEach(collection => {
      console.log(`  - ${collection.name} (${collection.type})`);
    });
    
    // Check the orders collection specifically
    console.log('\n--- Orders collection details ---');
    const ordersCollectionInfo = collections.find(c => c.name === 'orders');
    if (ordersCollectionInfo) {
      console.log('  Name:', ordersCollectionInfo.name);
      console.log('  Type:', ordersCollectionInfo.type);
      console.log('  Options:', JSON.stringify(ordersCollectionInfo.options, null, 2));
    }
    
    // Check for any validators using db.runCommand
    try {
      const collStats = await db.command({ collStats: 'orders' });
      console.log('\n📊 Orders collection stats:');
      console.log('  User flags:', collStats.userFlags);
      console.log('  Capped:', collStats.capped);
      console.log('  Size:', collStats.size);
      console.log('  Count:', collStats.count);
    } catch (statsError) {
      console.log('\n❌ Could not get collection stats:', statsError.message);
    }
    
    // Check for any indexes using listIndexes command
    try {
      const indexes = await db.collection('orders').listIndexes().toArray();
      console.log('\n📋 Orders collection indexes (via listIndexes):');
      indexes.forEach(index => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        if (index.unique) {
          console.log(`    ⚠️  UNIQUE INDEX`);
        }
      });
    } catch (indexError) {
      console.log('\n❌ Could not list indexes:', indexError.message);
    }
    
    // Check for any hidden validators using db.runCommand
    try {
      const collInfo = await db.command({ listCollections: 1, filter: { name: 'orders' } });
      console.log('\n📋 Orders collection info (via listCollections):');
      if (collInfo.cursor && collInfo.cursor.firstBatch && collInfo.cursor.firstBatch.length > 0) {
        const info = collInfo.cursor.firstBatch[0];
        console.log('  Options:', JSON.stringify(info.options, null, 2));
      }
    } catch (commandError) {
      console.log('\n❌ Could not get collection info via command:', commandError.message);
    }
    
    // Try to create a test document with explicit orderNumber field
    console.log('\n📝 Testing document creation with orderNumber field...');
    const testDoc = {
      orderId: `TEST-${Date.now()}`,
      orderNumber: null, // This should trigger the error if there's still an index
      testField: 'testValue'
    };
    
    try {
      const result = await db.collection('orders').insertOne(testDoc);
      console.log('✅ Document with orderNumber=null inserted successfully');
      await db.collection('orders').deleteOne({ _id: result.insertedId });
      console.log('🧹 Test document cleaned up');
    } catch (insertError) {
      console.log('❌ Document insertion failed:', insertError.message);
      if (insertError.code === 11000) {
        console.log('  ⚠️  DUPLICATE KEY ERROR CONFIRMED!');
        console.log('  Key pattern:', JSON.stringify(insertError.keyPattern));
        console.log('  Key value:', JSON.stringify(insertError.keyValue));
      }
    }
    
    // Try to create a test document without orderNumber field
    console.log('\n📝 Testing document creation without orderNumber field...');
    const testDoc2 = {
      orderId: `TEST2-${Date.now()}`,
      testField: 'testValue2'
    };
    
    try {
      const result = await db.collection('orders').insertOne(testDoc2);
      console.log('✅ Document without orderNumber inserted successfully');
      await db.collection('orders').deleteOne({ _id: result.insertedId });
      console.log('🧹 Test document cleaned up');
    } catch (insertError) {
      console.log('❌ Document insertion failed:', insertError.message);
      if (insertError.code === 11000) {
        console.log('  ⚠️  DUPLICATE KEY ERROR!');
        console.log('  Key pattern:', JSON.stringify(insertError.keyPattern));
        console.log('  Key value:', JSON.stringify(insertError.keyValue));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

systemIndexCheck();