import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
   const mongodbUri = ENV.MONGODB_URI;
   if (!mongodbUri) {
      throw new Error('Please provide a MongoDB URI');
   }
   try {
      const conn = await mongoose.connect(mongodbUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};

export default connectDB;
