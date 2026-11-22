const mongoose = require('mongoose');

/**
 * Utility to mask database passwords from connection strings and logs
 */
const sanitizeMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '';
  return uri.replace(/\/\/(.*?):(.*?)@/g, '//$1:****@');
};

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  // Validation for Production vs Development
  if (!mongoUri) {
    if (isProduction) {
      const err = new Error(
        'Missing MONGO_URI: Cloud deployment requires a MongoDB Atlas connection string configured in environment variables.'
      );
      console.error(`\n❌ [Database Config Error]: ${err.message}`);
      throw err;
    }
    // Local development fallback
    mongoUri = 'mongodb://127.0.0.1:27017/craftcart';
  } else if (
    isProduction &&
    (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost'))
  ) {
    const err = new Error(
      'Invalid MONGO_URI in production: Render cloud cannot connect to 127.0.0.1 / localhost. Please use a MongoDB Atlas connection URI.'
    );
    console.error(`\n❌ [Database Config Error]: ${err.message}`);
    throw err;
  }

  const safeTarget = sanitizeMongoUri(mongoUri);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    const safeError = sanitizeMongoUri(error.message);
    console.error(`\n❌ [MongoDB Connection Error]: ${safeError}`);
    console.error(`👉 Target Host: ${safeTarget}\n`);
    throw error;
  }
};

module.exports = connectDB;
