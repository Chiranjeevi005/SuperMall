// Script to test order creation in the exact same context as the application

// Mock the Next.js environment
global.mongoose = undefined;

// Set up environment variables
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';

async function appContextTest() {
  try {
    // Import the dbConnect function
    const { default: dbConnect } = await import('./src/lib/dbConnect.ts');
    
    console.log('🔌 Connecting to database...');
    const connection = await dbConnect();
    console.log('✅ Database connection state:', connection.connection?.readyState);
    
    // Import the Order model
    const { default: Order } = await import('./src/models/Order.ts');
    
    // Function to generate a unique order ID
    function generateOrderId() {
      // Use timestamp + random component for uniqueness
      const timestamp = Date.now().toString();
      const randomComponent = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `ORDER-${timestamp}-${randomComponent}`;
    }
    
    // Create a test order with the exact same structure as in the error
    const testOrder = {
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
      orderId: generateOrderId()
    };
    
    console.log('📝 Creating test order with app context...');
    console.log('📋 Order ID:', testOrder.orderId);
    
    try {
      // Try to create the order using Mongoose
      const order = await Order.create(testOrder);
      console.log('✅ Order created successfully!');
      console.log('📋 Order _id:', order._id);
      console.log('📋 Order orderId:', order.orderId);
      
      // Check if orderNumber field exists
      if (order.orderNumber !== undefined) {
        console.log('⚠️  Found orderNumber field:', order.orderNumber);
      } else {
        console.log('✅ No orderNumber field found');
      }
      
      // Clean up
      await Order.deleteOne({ _id: order._id });
      console.log('🧹 Test order cleaned up');
      
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
      
      // Check the current indexes
      const indexes = Order.schema._indexes;
      console.log('\n📋 Mongoose schema indexes:');
      console.log(indexes);
      
      // Check the collection indexes
      const collectionIndexes = await Order.collection.indexes();
      console.log('\n📋 Collection indexes:');
      collectionIndexes.forEach(index => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        if (index.unique) {
          console.log(`    ⚠️  UNIQUE INDEX`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

appContextTest();