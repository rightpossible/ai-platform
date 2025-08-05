import connectToDatabase from './connection';

// Export the connection function
export { default as connectDB } from './connection';

// Initialize connection for server-side usage
export async function initializeDB() {
  try {
    await connectToDatabase();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}