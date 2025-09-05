// Script to fix documents with null orderId values

const { MongoClient } = require('mongodb');

// Function to generate a unique order ID
function generateOrderId() {
  // Use timestamp + random component for uniqueness
  const timestamp = Date.now().toString();
  const randomComponent = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORDER-${timestamp}-${randomComponent}`;
}

async function fixNullOrderIdDocs() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // Find documents with null orderId
    const nullOrderIdDocs = await collection.find({ orderId: null }).toArray();
    console.log(`Found ${nullOrderIdDocs.length} documents with null orderId`);
    
    if (nullOrderIdDocs.length > 0) {
      console.log('Fixing documents with null orderId...');
      
      for (const doc of nullOrderIdDocs) {
        const newOrderId = generateOrderId();
        console.log(`  Updating document ${doc._id} with new orderId: ${newOrderId}`);
        
        try {
          await collection.updateOne(
            { _id: doc._id },
            { $set: { orderId: newOrderId } }
          );
          console.log(`    Successfully updated document ${doc._id}`);
        } catch (error) {
          console.error(`    Failed to update document ${doc._id}:`, error.message);
        }
      }
    } else {
      console.log('No documents with null orderId found');
    }
    
    // Find documents with missing orderId field
    const missingOrderIdDocs = await collection.find({ orderId: { $exists: false } }).toArray();
    console.log(`\nFound ${missingOrderIdDocs.length} documents missing orderId field`);
    
    if (missingOrderIdDocs.length > 0) {
      console.log('Fixing documents missing orderId field...');
      
      for (const doc of missingOrderIdDocs) {
        const newOrderId = generateOrderId();
        console.log(`  Updating document ${doc._id} with new orderId: ${newOrderId}`);
        
        try {
          await collection.updateOne(
            { _id: doc._id },
            { $set: { orderId: newOrderId } }
          );
          console.log(`    Successfully updated document ${doc._id}`);
        } catch (error) {
          console.error(`    Failed to update document ${doc._id}:`, error.message);
        }
      }
    } else {
      console.log('No documents missing orderId field found');
    }
    
    // Verify no documents have null or missing orderId
    const docsAfterFix = await collection.find({ 
      $or: [
        { orderId: null },
        { orderId: { $exists: false } }
      ]
    }).toArray();
    
    console.log(`\nAfter fix, found ${docsAfterFix.length} documents with null/missing orderId`);
    
    if (docsAfterFix.length > 0) {
      console.log('Remaining problematic documents:');
      docsAfterFix.forEach(doc => {
        console.log(`- _id: ${doc._id}, orderId: ${doc.orderId}`);
      });
    } else {
      console.log('All documents have valid orderId values');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

fixNullOrderIdDocs();