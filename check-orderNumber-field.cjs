// Script to check if there are any documents with orderNumber field in the orders collection

const { MongoClient } = require('mongodb');

async function checkOrderNumberField() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // Check if there are any documents with orderNumber field
    const docsWithOrderNumber = await collection.find({ orderNumber: { $exists: true } }).toArray();
    console.log(`Found ${docsWithOrderNumber.length} documents with orderNumber field`);
    
    if (docsWithOrderNumber.length > 0) {
      console.log('Sample documents with orderNumber field:');
      docsWithOrderNumber.slice(0, 3).forEach(doc => {
        console.log(`- _id: ${doc._id}, orderNumber: ${doc.orderNumber}`);
      });
      
      // Check if any have null values
      const docsWithNullOrderNumber = docsWithOrderNumber.filter(doc => doc.orderNumber === null);
      console.log(`Found ${docsWithNullOrderNumber.length} documents with null orderNumber`);
      
      if (docsWithNullOrderNumber.length > 0) {
        console.log('Sample documents with null orderNumber:');
        docsWithNullOrderNumber.slice(0, 3).forEach(doc => {
          console.log(`- _id: ${doc._id}, orderNumber: ${doc.orderNumber}`);
        });
      }
    } else {
      console.log('No documents with orderNumber field found');
    }
    
    // Check the schema validation if it exists
    const collections = await db.listCollections({ name: 'orders' }).toArray();
    if (collections.length > 0 && collections[0].options && collections[0].options.validator) {
      console.log('Collection validator:', JSON.stringify(collections[0].options.validator, null, 2));
    } else {
      console.log('No collection validator found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

checkOrderNumberField();