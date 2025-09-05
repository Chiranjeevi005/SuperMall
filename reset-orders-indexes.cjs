// Script to reset all indexes on the orders collection

const { MongoClient } = require('mongodb');

async function resetOrdersIndexes() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // List all current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Drop all indexes except _id_
    for (const index of indexes) {
      if (index.name !== '_id_') {
        console.log(`Dropping index: ${index.name}`);
        try {
          await collection.dropIndex(index.name);
          console.log(`  Successfully dropped ${index.name}`);
        } catch (error) {
          console.error(`  Failed to drop ${index.name}:`, error.message);
        }
      }
    }
    
    console.log('\nRemaining indexes after dropping:');
    const remainingIndexes = await collection.indexes();
    remainingIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\nCreating new indexes...');
    
    // Create the required indexes
    try {
      await collection.createIndex({ orderId: 1 }, { unique: true });
      console.log('  Created unique index on orderId');
    } catch (error) {
      console.error('  Failed to create orderId index:', error.message);
    }
    
    try {
      await collection.createIndex({ customer: 1, status: 1 });
      console.log('  Created index on customer and status');
    } catch (error) {
      console.error('  Failed to create customer/status index:', error.message);
    }
    
    try {
      await collection.createIndex({ paymentIntentId: 1 });
      console.log('  Created index on paymentIntentId');
    } catch (error) {
      console.error('  Failed to create paymentIntentId index:', error.message);
    }
    
    console.log('\nFinal indexes:');
    const finalIndexes = await collection.indexes();
    finalIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

resetOrdersIndexes();