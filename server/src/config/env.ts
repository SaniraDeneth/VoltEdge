import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
   'JWT_SECRET',
   'PORT',
   'MONGODB_URI',
   'NODE_ENV',
   'CLOUDINARY_CLOUD_NAME',
   'CLOUDINARY_API_KEY',
   'CLOUDINARY_API_SECRET',
] as const;

for (const envVar of requiredEnvVars) {
   if (!process.env[envVar]) {
      throw new Error(`FATAL ERROR: ${envVar} is not defined in .env file`);
   }
}

export const ENV = {
   JWT_SECRET: process.env.JWT_SECRET!,
   NODE_ENV: process.env.NODE_ENV!,
   PORT: process.env.PORT!,
   MONGODB_URI: process.env.MONGODB_URI!,
   CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
      API_KEY: process.env.CLOUDINARY_API_KEY!,
      API_SECRET: process.env.CLOUDINARY_API_SECRET!,
   },
} as const;
