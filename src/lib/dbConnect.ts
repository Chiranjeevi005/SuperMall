import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If we're already connected, return the existing connection
  if (cached.conn && cached.conn.connection?.readyState === 1) {
    return cached.conn;
  }

  // If we have a promise, return it
  if (cached.promise) {
    return cached.promise;
  }

  // Create a new connection promise
  const opts = {
    bufferCommands: true, // Changed to true to prevent the buffer error
  };

  console.log('Attempting to connect to MongoDB...');

  cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
    console.log('✅ MongoDB connected successfully');
    return mongoose;
  });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Database connection failed:', error);
    // In production, we should throw the error instead of returning a mock connection
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database connection failed');
    }
    // In development, we'll continue with mock connection for now
    return {
      connection: {
        readyState: 0,
      },
    } as any;
  }
}

export default dbConnect;

// Extend the global object to include mongoose
declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}