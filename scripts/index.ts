import { connectToDataBase } from '../dataBase/dbConfig';
import mongoose from 'mongoose';

// Database indexing for performance optimization
async function createIndexes() {
  try {
    console.log('🚀 Starting database indexing...');
    console.log('📡 Connecting to database...');
    
    await connectToDataBase();
    console.log('✅ Connected to database successfully!');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Users Collection Indexes
    console.log('🔍 Creating indexes for Users collection...');
    const usersCollection = db.collection('users');
    
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ role: 1 });
    await usersCollection.createIndex({ isActive: 1 });
    await usersCollection.createIndex({ stripeCustomerId: 1 }, { sparse: true });
    await usersCollection.createIndex({ emailVerified: 1 });
    await usersCollection.createIndex({ createdAt: -1 });
    await usersCollection.createIndex({ lastLoginAt: -1 });
    
    // Compound indexes for common queries
    await usersCollection.createIndex({ role: 1, isActive: 1 });
    await usersCollection.createIndex({ email: 1, isActive: 1 });
    
    console.log('   ✅ Users indexes created');

    // Categories Collection Indexes
    console.log('🔍 Creating indexes for Categories collection...');
    const categoriesCollection = db.collection('categories');
    
    await categoriesCollection.createIndex({ slug: 1 }, { unique: true });
    await categoriesCollection.createIndex({ parentCategory: 1 });
    await categoriesCollection.createIndex({ level: 1 });
    await categoriesCollection.createIndex({ isActive: 1 });
    await categoriesCollection.createIndex({ createdAt: -1 });
    
    // Compound indexes for hierarchical queries
    await categoriesCollection.createIndex({ parentCategory: 1, level: 1 });
    await categoriesCollection.createIndex({ level: 1, isActive: 1 });
    await categoriesCollection.createIndex({ parentCategory: 1, isActive: 1 });
    
    // Text index for search
    await categoriesCollection.createIndex({ 
      name: 'text', 
      description: 'text',
      seoTitle: 'text',
      seoDescription: 'text'
    });
    
    console.log('   ✅ Categories indexes created');

    // Products Collection Indexes
    console.log('🔍 Creating indexes for Products collection...');
    const productsCollection = db.collection('products');
    
    await productsCollection.createIndex({ slug: 1 }, { unique: true });
    await productsCollection.createIndex({ sku: 1 }, { unique: true });
    await productsCollection.createIndex({ category: 1 });
    await productsCollection.createIndex({ subcategory: 1 });
    await productsCollection.createIndex({ vendor: 1 });
    await productsCollection.createIndex({ brand: 1 });
    await productsCollection.createIndex({ price: 1 });
    await productsCollection.createIndex({ originalPrice: 1 });
    await productsCollection.createIndex({ rating: -1 });
    await productsCollection.createIndex({ reviewCount: -1 });
    await productsCollection.createIndex({ stock: 1 });
    await productsCollection.createIndex({ isActive: 1 });
    await productsCollection.createIndex({ isFeatured: 1 });
    await productsCollection.createIndex({ createdAt: -1 });
    await productsCollection.createIndex({ updatedAt: -1 });
    
    // Compound indexes for common product queries
    await productsCollection.createIndex({ category: 1, isActive: 1 });
    await productsCollection.createIndex({ vendor: 1, isActive: 1 });
    await productsCollection.createIndex({ brand: 1, isActive: 1 });
    await productsCollection.createIndex({ price: 1, isActive: 1 });
    await productsCollection.createIndex({ rating: -1, isActive: 1 });
    await productsCollection.createIndex({ isFeatured: 1, isActive: 1 });
    await productsCollection.createIndex({ category: 1, subcategory: 1 });
    await productsCollection.createIndex({ category: 1, price: 1 });
    await productsCollection.createIndex({ category: 1, rating: -1 });
    await productsCollection.createIndex({ vendor: 1, category: 1 });
    
    // Price range queries
    await productsCollection.createIndex({ price: 1, category: 1, isActive: 1 });
    
    // Text index for product search
    await productsCollection.createIndex({ 
      name: 'text', 
      description: 'text',
      'tags': 'text',
      brand: 'text'
    }, {
      weights: {
        name: 10,
        brand: 5,
        tags: 3,
        description: 1
      }
    });
    
    console.log('   ✅ Products indexes created');

    // Orders Collection Indexes
    console.log('🔍 Creating indexes for Orders collection...');
    const ordersCollection = db.collection('orders');
    
    await ordersCollection.createIndex({ orderNumber: 1 }, { unique: true });
    await ordersCollection.createIndex({ user: 1 });
    await ordersCollection.createIndex({ status: 1 });
    await ordersCollection.createIndex({ paymentStatus: 1 });
    await ordersCollection.createIndex({ paymentIntentId: 1 }, { sparse: true });
    await ordersCollection.createIndex({ createdAt: -1 });
    await ordersCollection.createIndex({ updatedAt: -1 });
    await ordersCollection.createIndex({ paidAt: -1 }, { sparse: true });
    await ordersCollection.createIndex({ 'items.vendor': 1 });
    await ordersCollection.createIndex({ 'items.product': 1 });
    
    // Compound indexes for order queries
    await ordersCollection.createIndex({ user: 1, status: 1 });
    await ordersCollection.createIndex({ user: 1, createdAt: -1 });
    await ordersCollection.createIndex({ status: 1, createdAt: -1 });
    await ordersCollection.createIndex({ paymentStatus: 1, createdAt: -1 });
    await ordersCollection.createIndex({ 'items.vendor': 1, status: 1 });
    await ordersCollection.createIndex({ 'items.vendor': 1, createdAt: -1 });
    
    // Order tracking
    await ordersCollection.createIndex({ 'trackingHistory.status': 1 });
    await ordersCollection.createIndex({ 'trackingHistory.timestamp': -1 });
    
    console.log('   ✅ Orders indexes created');

    // Carts Collection Indexes
    console.log('🔍 Creating indexes for Carts collection...');
    const cartsCollection = db.collection('carts');
    
    await cartsCollection.createIndex({ user: 1 }, { unique: true });
    await cartsCollection.createIndex({ 'items.product': 1 });
    await cartsCollection.createIndex({ updatedAt: -1 });
    await cartsCollection.createIndex({ createdAt: -1 });
    
    // Compound indexes for cart queries
    await cartsCollection.createIndex({ user: 1, updatedAt: -1 });
    
    console.log('   ✅ Carts indexes created');

    // Additional performance indexes
    console.log('🔍 Creating additional performance indexes...');
    
    // Geospatial indexes for location-based features (future use)
    // await usersCollection.createIndex({ location: '2dsphere' });
    
    // TTL indexes for temporary data (sessions, tokens, etc.)
    await usersCollection.createIndex({ 
      passwordResetExpires: 1 
    }, { 
      expireAfterSeconds: 0,
      sparse: true 
    });
    
    console.log('   ✅ Additional indexes created');

    // Display index information
    console.log('📊 Index Summary:');
    
    const userIndexes = await usersCollection.listIndexes().toArray();
    const categoryIndexes = await categoriesCollection.listIndexes().toArray();
    const productIndexes = await productsCollection.listIndexes().toArray();
    const orderIndexes = await ordersCollection.listIndexes().toArray();
    const cartIndexes = await cartsCollection.listIndexes().toArray();
    
    console.log(`   Users: ${userIndexes.length} indexes`);
    console.log(`   Categories: ${categoryIndexes.length} indexes`);
    console.log(`   Products: ${productIndexes.length} indexes`);
    console.log(`   Orders: ${orderIndexes.length} indexes`);
    console.log(`   Carts: ${cartIndexes.length} indexes`);

    console.log('🎉 Database indexing completed successfully!');
    
    // Performance recommendations
    console.log('💡 Performance Recommendations:');
    console.log('   1. Monitor query performance using MongoDB Compass or explain() method');
    console.log('   2. Consider creating partial indexes for frequently filtered fields');
    console.log('   3. Use compound indexes for multi-field queries');
    console.log('   4. Regularly analyze and optimize slow queries');
    console.log('   5. Consider sharding for large-scale deployments');

  } catch (error: any) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
}

// Performance analysis function
async function analyzePerformance() {
  try {
    console.log('📈 Analyzing database performance...');
    
    await connectToDataBase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Get collection stats
    const collections = ['users', 'categories', 'products', 'orders', 'carts'];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const stats = await db.command({ collStats: collectionName });
      
      console.log(`📊 ${collectionName.toUpperCase()} Collection Stats:`);
      console.log(`   Documents: ${stats.count ? stats.count.toLocaleString() : 'N/A'}`);
      console.log(`   Size: ${stats.size ? (stats.size / 1024 / 1024).toFixed(2) : 'N/A'} MB`);
      console.log(`   Average Document Size: ${stats.avgObjSize ? stats.avgObjSize.toFixed(0) : 'N/A'} bytes`);
      console.log(`   Total Indexes: ${stats.nindexes ? stats.nindexes : 'N/A'}`);
      console.log(`   Index Size: ${stats.totalIndexSize ? (stats.totalIndexSize / 1024 / 1024).toFixed(2) : 'N/A'} MB`);
      console.log('');
    }

  } catch (error: any) {
    console.error('❌ Error analyzing performance:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Main function
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--analyze')) {
    analyzePerformance()
      .then(() => process.exit(0))
      .catch((error: any) => {
        console.error('❌ Performance analysis failed:', error);
        process.exit(1);
      });
  } else {
    createIndexes()
      .then(() => {
        console.log('✅ Indexing process completed successfully!');
        process.exit(0);
      })
      .catch((error: any) => {
        console.error('❌ Indexing process failed:', error);
        process.exit(1);
      });
  }
}

export { createIndexes, analyzePerformance };