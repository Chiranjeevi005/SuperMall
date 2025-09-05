// Script to directly test order creation in the database

const { MongoClient } = require('mongodb');

// Function to generate a unique order ID
function generateOrderId() {
  // Use timestamp + random component for uniqueness
  const timestamp = Date.now().toString();
  const randomComponent = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORDER-${timestamp}-${randomComponent}`;
}

async function directDbTest() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('supermall');
    const collection = db.collection('orders');
    
    // Create a test order directly
    const testOrder = {
      orderId: generateOrderId(),
      customer: '65f1a0b1c2d3e4f5a6b7c8d9',
      vendor: '65f1a0b1c2d3e4f5a6b7c8e0',
      items: [
        { 
          product: '68ba605120021939d52e142c', 
          quantity: 1, 
          price: 2900 
        }
      ],
      totalAmount: 2900,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      notes: 'Direct DB test order'
    };
    
    console.log('📝 Creating test order directly in DB...');
    console.log('📋 Order ID:', testOrder.orderId);
    
    try {
      // Try to insert the order
      const result = await collection.insertOne(testOrder);
      console.log('✅ Order created successfully!');
      console.log('📋 Inserted document ID:', result.insertedId);
      
      // Verify the order exists
      const createdOrder = await collection.findOne({ _id: result.insertedId });
      if (createdOrder) {
        console.log('✅ Order verified in database');
        console.log('📋 Order details:');
        console.log('   Order ID:', createdOrder.orderId);
        console.log('   Customer:', createdOrder.customer);
        console.log('   Total Amount:', createdOrder.totalAmount);
        console.log('   Status:', createdOrder.status);
        
        // Check if orderNumber field exists
        if (createdOrder.orderNumber !== undefined) {
          console.log('⚠️  Found orderNumber field:', createdOrder.orderNumber);
        } else {
          console.log('✅ No orderNumber field found');
        }
      } else {
        console.log('❌ Failed to verify order in database');
      }
      
      // Clean up - remove the test order
      console.log('\n🧹 Cleaning up test order...');
      await collection.deleteOne({ _id: result.insertedId });
      console.log('✅ Test order cleaned up');
      
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      if (error.keyPattern) {
        console.error('Key pattern:', JSON.stringify(error.keyPattern));
      }
      if (error.keyValue) {
        console.error('Key value:', JSON.stringify(error.keyValue));
      }
      
      // Let's try to understand what index is causing the issue
      const indexes = await collection.indexes();
      console.log('\n📋 Current indexes:');
      indexes.forEach(index => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        if (index.unique) {
          console.log(`    ⚠️  UNIQUE INDEX`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

directDbTest();