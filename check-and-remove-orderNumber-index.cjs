// Script to check and remove all orderNumber related indexes from the orders collection
// Run this script to fix the MongoDB duplicate key error

const { MongoClient } = require('mongodb');

async function checkAndRemoveOrderNumberIndex() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // List all indexes to see what we have
    const indexes = await collection.indexes();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check for any index that includes orderNumber
    const orderNumberIndexes = indexes.filter(index => 
      Object.keys(index.key).includes('orderNumber')
    );
    
    if (orderNumberIndexes.length > 0) {
      console.log('\nFound orderNumber related indexes:');
      orderNumberIndexes.forEach(index => {
        console.log(`- Removing ${index.name}: ${JSON.stringify(index.key)}`);
        try {
          collection.dropIndex(index.name);
          console.log(`  Successfully removed ${index.name}`);
        } catch (error) {
          console.error(`  Failed to remove ${index.name}:`, error.message);
        }
      });
    } else {
      console.log('\nNo orderNumber related indexes found');
    }
    
    console.log('\nRemaining indexes:');
    const remainingIndexes = await collection.indexes();
    remainingIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

checkAndRemoveOrderNumberIndex();