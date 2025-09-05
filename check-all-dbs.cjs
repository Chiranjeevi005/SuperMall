// Script to check all databases and collections for orderNumber indexes

const { MongoClient } = require('mongodb');

async function checkAllDbs() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    console.log('📋 All databases:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    
    // Check each database for collections with orderNumber indexes
    for (const dbInfo of databases.databases) {
      const dbName = dbInfo.name;
      
      // Skip system databases
      if (['admin', 'config', 'local'].includes(dbName)) {
        continue;
      }
      
      console.log(`\n--- Checking database: ${dbName} ---`);
      const db = client.db(dbName);
      
      try {
        // List collections
        const collections = await db.listCollections().toArray();
        console.log(`  📋 Collections:`);
        collections.forEach(collection => {
          console.log(`    - ${collection.name}`);
        });
        
        // Check each collection
        for (const collectionInfo of collections) {
          const collectionName = collectionInfo.name;
          console.log(`\n    --- Checking collection: ${dbName}.${collectionName} ---`);
          
          try {
            const collection = db.collection(collectionName);
            const indexes = await collection.indexes();
            
            // Check for orderNumber indexes
            const orderNumberIndexes = indexes.filter(index => 
              Object.keys(index.key).some(key => key.includes('orderNumber'))
            );
            
            if (orderNumberIndexes.length > 0) {
              console.log(`      ⚠️  Found orderNumber indexes:`);
              orderNumberIndexes.forEach(index => {
                console.log(`        - ${index.name}: ${JSON.stringify(index.key)}`);
                if (index.unique) {
                  console.log(`          ⚠️  UNIQUE INDEX`);
                }
              });
            } else {
              console.log(`      ✅ No orderNumber indexes found`);
            }
            
            // Check for documents with orderNumber field
            const sampleDocs = await collection.find({ orderNumber: { $exists: true } }).limit(3).toArray();
            if (sampleDocs.length > 0) {
              console.log(`      ⚠️  Found documents with orderNumber field:`);
              sampleDocs.forEach((doc, i) => {
                console.log(`        ${i+1}. _id: ${doc._id}, orderNumber: ${doc.orderNumber}`);
              });
            }
            
          } catch (error) {
            console.log(`      ❌ Error checking collection ${collectionName}:`, error.message);
          }
        }
        
      } catch (error) {
        console.log(`  ❌ Error checking database ${dbName}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkAllDbs();