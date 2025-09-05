// Script to reproduce the exact error

const { MongoClient } = require('mongodb');

// Function to generate a unique order ID
function generateOrderId() {
  // Use timestamp + random component for uniqueness
  const timestamp = Date.now().toString();
  const randomComponent = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORDER-${timestamp}-${randomComponent}`;
}

async function reproduceError() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // Try to create an order with the exact same structure as in the error
    const orderData = {
      customer: '65f1a0b1c2d3e4f5a6b7c8d9',
      vendor: '65f1a0b1c2d3e4f5a6b7c8e0',
      items: [
        { product: '68ba605120021939d52e1438', quantity: 1, price: 520 },
        { product: '68ba605120021939d52e1432', quantity: 1, price: 450 },
        { product: '68ba605120021939d52e142c', quantity: 1, price: 2900 },
        { product: '68ba605120021939d52e1426', quantity: 1, price: 750 },
        { product: '68ba605120021939d52e140e', quantity: 1, price: 70 },
        { product: '68ba605120021939d52e1414', quantity: 1, price: 110 },
        { product: '68ba605120021939d52e141a', quantity: 1, price: 55 },
        { product: '68ba605120021939d52e1420', quantity: 1, price: 190 }
      ],
      totalAmount: 5045,
      shippingAddress: {
        street: '#434 1st main 1st cross Raghavendra Nagar Bangalore',
        city: 'Bangalore',
        state: 'KARNATAKA',
        zipCode: '560091',
        country: 'India'
      },
      paymentMethod: 'cod',
      notes: '',
      status: 'pending',
      paymentStatus: 'pending',
      orderId: generateOrderId() // Generate a new order ID
    };
    
    console.log('📝 Creating order with exact structure from error...');
    console.log('📋 Order ID:', orderData.orderId);
    
    try {
      // Try to insert the order
      const result = await collection.insertOne(orderData);
      console.log('✅ Order created successfully!');
      console.log('📋 Inserted document ID:', result.insertedId);
      
      // Clean up
      await collection.deleteOne({ _id: result.insertedId });
      console.log('✅ Test order cleaned up');
      
    } catch (error) {
      console.error('❌ Order creation failed:', error.message);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      
      if (error.keyPattern) {
        console.error('Key pattern:', JSON.stringify(error.keyPattern));
      }
      if (error.keyValue) {
        console.error('Key value:', JSON.stringify(error.keyValue));
      }
      
      // Let's try to understand what's happening by checking all indexes again
      const indexes = await collection.indexes();
      console.log('\n📋 Current indexes:');
      indexes.forEach(index => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        if (index.unique) {
          console.log(`    ⚠️  UNIQUE INDEX`);
        }
      });
      
      // Check if there's any document that might conflict
      const conflictingDoc = await collection.findOne({ orderId: orderData.orderId });
      if (conflictingDoc) {
        console.log('\n⚠️  Found conflicting document:');
        console.log('  _id:', conflictingDoc._id);
        console.log('  orderId:', conflictingDoc.orderId);
        console.log('  orderNumber:', conflictingDoc.orderNumber);
      } else {
        console.log('\n✅ No conflicting document found with same orderId');
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

reproduceError();