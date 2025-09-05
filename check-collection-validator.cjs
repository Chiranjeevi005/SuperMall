// Script to check the collection validator for the orders collection

const { MongoClient } = require('mongodb');

async function checkCollectionValidator() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('supermall');
    
    // Get collection info including validator
    const collections = await db.listCollections({ name: 'orders' }).toArray();
    
    if (collections.length > 0) {
      console.log('Collection info:');
      console.log(JSON.stringify(collections[0], null, 2));
      
      if (collections[0].options && collections[0].options.validator) {
        console.log('\nCollection validator:');
        console.log(JSON.stringify(collections[0].options.validator, null, 2));
      } else {
        console.log('\nNo collection validator found');
      }
    } else {
      console.log('Orders collection not found');
    }
    
    // Check if there are any documents with orderNumber field
    const collection = db.collection('orders');
    const docsWithOrderNumber = await collection.find({ orderNumber: { $exists: true } }).toArray();
    console.log(`\nFound ${docsWithOrderNumber.length} documents with orderNumber field`);
    
    if (docsWithOrderNumber.length > 0) {
      console.log('Sample documents with orderNumber field:');
      docsWithOrderNumber.slice(0, 3).forEach(doc => {
        console.log(`- _id: ${doc._id}, orderNumber: ${doc.orderNumber}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

checkCollectionValidator();