import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
   throw new Error('FATAL ERROR: JWT_SECRET is not defined in .env file');
}

if (!process.env.PORT) {
   throw new Error('FATAL ERROR: PORT is not defined in .env file');
}

if (!process.env.MONGODB_URI) {
   throw new Error('FATAL ERROR: MONGODB_URI is not defined in .env file');
}

if (!process.env.NODE_ENV) {
   throw new Error('FATAL ERROR: NODE_ENV is not defined in .env file');
}

export const ENV = {
   JWT_SECRET: process.env.JWT_SECRET,
   NODE_ENV: process.env.NODE_ENV,
   PORT: process.env.PORT,
   MONGODB_URI: process.env.MONGODB_URI,
} as const;
