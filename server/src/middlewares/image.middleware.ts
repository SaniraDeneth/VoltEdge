import type { NextFunction, Request, Response } from 'express';

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
