import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
   'JWT_SECRET',
   'JWT_REFRESH_SECRET',
   'PORT',
   'MONGODB_URI',
   'NODE_ENV',
   'GOOGLE_CLIENT_ID',
   'FRONTEND_URL',
   'STRIPE_SECRET_KEY',
   'STRIPE_WEBHOOK_SECRET',
] as const;

for (const envVar of requiredEnvVars) {
   if (envVar === 'STRIPE_WEBHOOK_SECRET' && process.env.NODE_ENV === 'dev') {
      continue;
   }
   if (!process.env[envVar]) {
      throw new Error(`FATAL ERROR: ${envVar} is not defined in .env file`);
   }
}

export const ENV = {
   JWT_SECRET: process.env.JWT_SECRET!,
   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
   NODE_ENV: process.env.NODE_ENV!,
   PORT: process.env.PORT!,
   MONGODB_URI: process.env.MONGODB_URI!,
   GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
   FRONTEND_URL: process.env.FRONTEND_URL!,
   STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
   STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
   CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
      API_KEY: process.env.CLOUDINARY_API_KEY || '',
      API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
   },
} as const;
