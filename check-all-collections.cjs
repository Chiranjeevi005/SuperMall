// Script to check all collections and their indexes

const { MongoClient } = require('mongodb');

async function checkAllCollections() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📋 All collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check each collection for orderNumber indexes
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n--- Checking collection: ${collectionName} ---`);
      
      try {
        const collection = db.collection(collectionName);
        const indexes = await collection.indexes();
        
        // Check for any indexes with orderNumber
        const orderNumberIndexes = indexes.filter(index => 
          Object.keys(index.key).some(key => key.includes('orderNumber'))
        );
        
        if (orderNumberIndexes.length > 0) {
          console.log(`  ⚠️  Found orderNumber indexes:`);
          orderNumberIndexes.forEach(index => {
            console.log(`    - ${index.name}: ${JSON.stringify(index.key)}`);
          });
        } else {
          console.log(`  ✅ No orderNumber indexes found`);
        }
        
        // Check for any documents with orderNumber field
        const sampleDocs = await collection.find({ orderNumber: { $exists: true } }).limit(3).toArray();
        if (sampleDocs.length > 0) {
          console.log(`  ⚠️  Found documents with orderNumber field:`);
          sampleDocs.forEach((doc, i) => {
            console.log(`    ${i+1}. _id: ${doc._id}, orderNumber: ${doc.orderNumber}`);
          });
        }
      } catch (error) {
        console.log(`  ❌ Error checking collection ${collectionName}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkAllCollections();