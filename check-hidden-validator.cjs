// Script to check for any hidden validators or constraints

const { MongoClient } = require('mongodb');

async function checkHiddenValidator() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    
    // Check collection info
    const collections = await db.listCollections({ name: 'orders' }).toArray();
    console.log('📋 Collection info:');
    console.log(JSON.stringify(collections, null, 2));
    
    // Check for validators
    if (collections.length > 0 && collections[0].options) {
      console.log('\n📋 Collection options:');
      console.log(JSON.stringify(collections[0].options, null, 2));
      
      if (collections[0].options.validator) {
        console.log('\n❌ FOUND VALIDATOR:');
        console.log(JSON.stringify(collections[0].options.validator, null, 2));
      } else {
        console.log('\n✅ No validator found');
      }
    }
    
    // Check the actual collection validator
    const collectionInfo = await db.admin().command({
      listCollections: 1,
      filter: { name: 'orders' }
    });
    
    console.log('\n📋 Detailed collection info:');
    if (collectionInfo.cursor && collectionInfo.cursor.firstBatch && collectionInfo.cursor.firstBatch.length > 0) {
      const orderCollection = collectionInfo.cursor.firstBatch[0];
      console.log(JSON.stringify(orderCollection, null, 2));
      
      if (orderCollection.options && orderCollection.options.validator) {
        console.log('\n❌ FOUND HIDDEN VALIDATOR:');
        console.log(JSON.stringify(orderCollection.options.validator, null, 2));
      }
    }
    
    // Check for any indexes with orderNumber
    const collection = db.collection('orders');
    const indexes = await collection.indexes();
    console.log('\n📋 All indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
      if (index.name.includes('orderNumber')) {
        console.log(`    ⚠️  This index contains orderNumber!`);
      }
    });
    
    // Check for any documents that might have orderNumber
    const sampleDocs = await collection.find({ orderNumber: { $exists: true } }).limit(5).toArray();
    console.log(`\n📋 Sample documents with orderNumber (limit 5): ${sampleDocs.length}`);
    if (sampleDocs.length > 0) {
      sampleDocs.forEach((doc, i) => {
        console.log(`  ${i+1}. _id: ${doc._id}, orderNumber: ${doc.orderNumber}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkHiddenValidator();