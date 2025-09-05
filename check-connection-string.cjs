// Script to check the exact connection string being used

const { MongoClient } = require('mongodb');

// Try to get the MONGODB_URI from environment
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermall';

console.log('📋 Environment MONGODB_URI:', process.env.MONGODB_URI);
console.log('📋 Using URI:', uri);

// Parse the URI to see what database it's connecting to
try {
  const url = new URL(uri);
  console.log('📋 Parsed URI:');
  console.log('  Protocol:', url.protocol);
  console.log('  Host:', url.hostname);
  console.log('  Port:', url.port);
  console.log('  Path:', url.pathname);
  console.log('  Database:', url.pathname.substring(1)); // Remove leading slash
} catch (error) {
  console.log('❌ Could not parse URI:', error.message);
}

// Try to connect and check what database we're actually connected to
async function checkActualConnection() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    console.log('📋 Actual database name:', db.databaseName);
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    console.log('📋 All databases:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkActualConnection();