// Script to remove the orderNumber field from all documents

const { MongoClient } = require('mongodb');

async function removeOrderNumberField() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // Check how many documents have orderNumber field
    const orderNumberDocs = await collection.find({ orderNumber: { $exists: true } }).toArray();
    console.log(`🔍 Found ${orderNumberDocs.length} documents with orderNumber field`);
    
    if (orderNumberDocs.length > 0) {
      console.log('🗑️  Removing orderNumber field from all documents...');
      
      const result = await collection.updateMany(
        { orderNumber: { $exists: true } },
        { $unset: { orderNumber: "" } }
      );
      
      console.log(`✅ Successfully removed orderNumber field from ${result.modifiedCount} documents`);
    } else {
      console.log('✅ No documents with orderNumber field found');
    }
    
    // Verify the field is removed
    const remainingOrderNumberDocs = await collection.find({ orderNumber: { $exists: true } }).toArray();
    console.log(`🔍 After removal, found ${remainingOrderNumberDocs.length} documents with orderNumber field`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

removeOrderNumberField();