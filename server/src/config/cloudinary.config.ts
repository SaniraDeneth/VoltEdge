import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ENV } from './env.js';

interface CloudinaryParams {
   folder: string;
   allowed_formats: string[];
   transformation: { width: number; height: number; crop: string }[];
}

cloudinary.config({
   cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
   api_key: ENV.CLOUDINARY.API_KEY,
   api_secret: ENV.CLOUDINARY.API_SECRET,
});

const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: {
      folder: 'VoltEdge-Products',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
   } as CloudinaryParams,
});

export { cloudinary, storage };
