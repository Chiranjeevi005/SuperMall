// Script to remove the orderNumber index from the orders collection
// Run this script to fix the MongoDB duplicate key error

const { MongoClient } = require('mongodb');

async function removeOrderNumberIndex() {
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
    
    // Check if orderNumber_1 index exists
    const orderNumberIndex = indexes.find(index => index.name === 'orderNumber_1');
    if (orderNumberIndex) {
      console.log('\nRemoving orderNumber_1 index...');
      await collection.dropIndex('orderNumber_1');
      console.log('Successfully removed orderNumber_1 index');
    } else {
      console.log('\norderNumber_1 index not found, nothing to remove');
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

removeOrderNumberIndex();