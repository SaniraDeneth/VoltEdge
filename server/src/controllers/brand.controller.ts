import type { Request, Response } from 'express';
import { HTTP_STATUS } from '../enums/http.status.js';
import Brand from '../models/brand.model.js';
import { AppError } from '../utils/app.error.js';
import { z } from 'zod';
import { brandSchema } from '../schemas/brand.schema.js';
import type { idParamSchema } from '../schemas/common.schema.js';

type BrandRequest = z.infer<typeof brandSchema>;
type ReqParam = z.infer<typeof idParamSchema>;

export const getBrands = async (req: Request, res: Response) => {
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
   const { name, image } = req.body as BrandRequest;

   const existingBrand = await Brand.findOne({ name });
   if (existingBrand) {
      throw new AppError(
         'Brand already exists.',
         HTTP_STATUS.BAD_REQUEST,
         'ALREADY_EXISTS'
      );
   }

   const brand = await Brand.create({ name, image });

   return res.status(HTTP_STATUS.CREATED).json(brand);
};

export const deleteBrand = async (req: Request, res: Response) => {
   const { id } = req.params as ReqParam;

   const deleted = await Brand.findByIdAndDelete(id);
   if (!deleted) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.NO_CONTENT).send();
};

export const updateBrand = async (req: Request, res: Response) => {
   const { id } = req.params as ReqParam;
   const { name, image } = req.body as BrandRequest;

   const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, image },
      { new: true }
   );

   if (!updatedBrand) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.OK).json(updatedBrand);
};
