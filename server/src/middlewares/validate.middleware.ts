import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { HTTP_STATUS } from '../enums/http.status.js';
import { AppError } from '../utils/app.error.js';
import { cleanupUploadedFiles } from './image.middleware.js';

type ValidationSource = 'body' | 'params' | 'query';

export const validate = (
   schema: z.ZodTypeAny,
   source: ValidationSource = 'body'
) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      try {
         const validatedData = await schema.parseAsync(req[source]);

         req[source] = validatedData;

         return next();
      } catch (error) {
         if (req.files) {
            await cleanupUploadedFiles(
               Array.isArray(req.files)
                  ? (req.files as Express.Multer.File[])
                  : (Object.values(req.files).flat() as Express.Multer.File[])
            );
         }

         if (error instanceof ZodError) {
            const errorMessages = error.issues
               .map((err) => `${err.path.join('.')}: ${err.message}`)
               .join(', ');

            return next(
               new AppError(
                  errorMessages,
                  HTTP_STATUS.BAD_REQUEST,
                  'VALIDATION_ERROR'
               )
            );
         }
         return next(error);
      }
   };
};
