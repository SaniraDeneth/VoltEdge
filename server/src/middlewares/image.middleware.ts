import type { NextFunction, Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.config.js';

export const processImages = (
   req: Request,
   _res: Response,
   next: NextFunction
) => {
   let existingImages: string[] = [];

   if (req.body.images) {
      try {
         const parsed =
            typeof req.body.images === 'string'
               ? JSON.parse(req.body.images)
               : req.body.images;
         existingImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
         existingImages = [req.body.images];
      }
   }

   const newImages =
      req.files && Array.isArray(req.files)
         ? (req.files as Express.Multer.File[]).map((file) => file.path)
         : [];

   req.body.images = [...existingImages, ...newImages];
   next();
};

export const cleanupUploadedFiles = async (files?: Express.Multer.File[]) => {
   if (!files || !Array.isArray(files) || files.length === 0) return;

   try {
      const deletePromises = files.map((file: Express.Multer.File) => {
         const publicId = file.filename;
         return cloudinary.uploader.destroy(publicId);
      });

      await Promise.all(deletePromises);
   } catch (error) {
      console.error('Failed to cleanup images from Cloudinary:', error);
   }
};

export const deleteImagesFromUrls = async (urls: string[]) => {
   if (!urls || urls.length === 0) return;

   try {
      const deletePromises = urls.map((url) => {
         const parts = url.split('/');
         const fileNameWithExt = parts.pop() || '';
         const folderName = parts.pop() || '';
         const publicId = `${folderName}/${fileNameWithExt.split('.')[0]}`;

         return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises);
   } catch (error) {
      console.error('Error deleting images from Cloudinary:', error);
   }
};
