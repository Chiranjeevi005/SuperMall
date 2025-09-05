const mongoose = require('mongoose');

// Use the same connection string from .env.local
const MONGODB_URI = 'mongodb://localhost:27017/supermall';

console.log('Testing MongoDB connection...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  mongoose.connection.close();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});