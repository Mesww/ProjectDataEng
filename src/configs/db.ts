import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGOURL || 'mongodb://localhost:27017/library';
    console.log(mongoURI);
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;