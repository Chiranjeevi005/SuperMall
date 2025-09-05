// Script to reset Mongoose connection

const mongoose = require('mongoose');

async function resetMongoose() {
  try {
    // Disconnect from MongoDB
    console.log('🔌 Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
    // Clear the global mongoose cache
    console.log('🗑️  Clearing global mongoose cache...');
    global.mongoose = undefined;
    
    console.log('✅ Mongoose reset completed');
    
  } catch (error) {
    console.error('❌ Error resetting Mongoose:', error);
  }
}

resetMongoose();