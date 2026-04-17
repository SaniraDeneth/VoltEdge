import type { NextFunction, Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.config.js';

export const processImages = (
   req: Request,
   _res: Response,
   next: NextFunction
) => {
   let existingImages: string[] = [];

   const rawImages = req.body.images || req.body.image;
   if (rawImages) {
      try {
         const parsed =
            typeof rawImages === 'string' ? JSON.parse(rawImages) : rawImages;
         existingImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
         existingImages = [rawImages];
      }
   }

   const newImages =
      req.files && Array.isArray(req.files)
         ? (req.files as Express.Multer.File[]).map((file) => file.path)
         : req.file
           ? [(req.file as Express.Multer.File).path]
           : [];

   req.body.images = [...existingImages, ...newImages];

   if (req.body.images.length > 0) {
      req.body.image = req.body.images[0];
   }

   next();
};

export const cleanupUploadedFiles = async (
   files?: Express.Multer.File[] | Express.Multer.File
) => {
   if (!files) return;

   const filesArray = Array.isArray(files) ? files : [files];
   if (filesArray.length === 0) return;

   try {
      const deletePromises = filesArray.map((file: Express.Multer.File) => {
         const publicId = file.filename;
         return cloudinary.uploader.destroy(publicId);
      });

      await Promise.all(deletePromises);
   } catch (error) {
      console.error('Failed to cleanup images from Cloudinary:', error);
   }
};

export const deleteImagesFromUrls = async (urls: string | string[]) => {
   if (!urls) return;

   const urlArray = Array.isArray(urls) ? urls : [urls];
   if (urlArray.length === 0) return;

   try {
      const deletePromises = urlArray.map((url) => {
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
