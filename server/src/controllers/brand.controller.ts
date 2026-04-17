import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../enums/http.status.js';
import Brand from '../models/brand.model.js';
import { AppError } from '../utils/app.error.js';
import { z } from 'zod';
import { brandSchema } from '../schemas/brand.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';
import {
   cleanupUploadedFiles,
   deleteImagesFromUrls,
} from '../middlewares/image.middleware.js';

type BrandRequest = z.infer<typeof brandSchema>;
type ReqParam = z.infer<typeof idParamSchema>;

export const getBrands = async (_req: Request, res: Response) => {
   const brands = await Brand.find();
   return res.status(HTTP_STATUS.OK).json(brands);
};

export const getBrand = async (req: Request, res: Response) => {
   const { id } = req.params as ReqParam;

   const brand = await Brand.findById(id);
   if (!brand) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.OK).json(brand);
};

export const createBrand = async (req: Request, res: Response) => {
   const brandData = req.body as BrandRequest;

   const existingBrand = await Brand.findOne({ name: brandData.name });
   if (existingBrand) {
      if (req.file) {
         await cleanupUploadedFiles(req.file);
      }
      throw new AppError(
         'Brand already exists.',
         HTTP_STATUS.BAD_REQUEST,
         'ALREADY_EXISTS'
      );
   }

   try {
      const brand = await Brand.create(brandData);
      return res.status(HTTP_STATUS.CREATED).json(brand);
   } catch (error) {
      if (req.file) {
         await cleanupUploadedFiles(req.file);
      }
      throw error;
   }
};

export const deleteBrand = async (req: Request, res: Response) => {
   const { id } = req.params as ReqParam;

   const brand = await Brand.findById(id);
   if (!brand) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   if (brand.image) {
      await deleteImagesFromUrls(brand.image);
   }

   await Brand.findByIdAndDelete(id);

   return res.status(HTTP_STATUS.NO_CONTENT).send();
};

export const updateBrand = async (req: Request, res: Response) => {
   const { id } = req.params as ReqParam;
   const updateData = req.body as BrandRequest;

   try {
      const oldBrand = await Brand.findById(id);
      if (!oldBrand) {
         if (req.file) {
            await cleanupUploadedFiles(req.file);
         }
         throw new AppError(
            'Brand not found',
            HTTP_STATUS.NOT_FOUND,
            'NOT_FOUND'
         );
      }

      if (req.file && oldBrand.image) {
         await deleteImagesFromUrls(oldBrand.image);
      }

      const updatedBrand = await Brand.findByIdAndUpdate(id, updateData, {
         new: true,
      });

      return res.status(HTTP_STATUS.OK).json(updatedBrand);
   } catch (error) {
      if (req.file) {
         await cleanupUploadedFiles(req.file);
      }
      throw error;
   }
};
