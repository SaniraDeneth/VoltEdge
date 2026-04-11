import mongoose from 'mongoose';

const connectDB = async () => {
   const mongodbUri = process.env.MONGODB_URI;
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
