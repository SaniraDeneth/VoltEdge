import type { Request, Response } from 'express';
import { HTTP_STATUS } from '../enums/http.status.js';
import Brand from '../models/brand.model.js';
import { AppError } from '../utils/app.error.js';

export const createBrand = async (req: Request, res: Response) => {
   const { name, image } = req.body;

   if (!name || !image) {
      throw new AppError(
         'Please provide all the required fields',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

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

export const getBrands = async (req: Request, res: Response) => {
   const brands = await Brand.find();
   return res.status(HTTP_STATUS.OK).json(brands);
};

export const getBrand = async (req: Request, res: Response) => {
   const { id } = req.params;

   const brand = await Brand.findById(id);
   if (!brand) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.OK).json(brand);
};

export const deleteBrand = async (req: Request, res: Response) => {
   const { id } = req.params;

   const deleted = await Brand.findByIdAndDelete(id);
   if (!deleted) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.NO_CONTENT).send();
};

export const updateBrand = async (req: Request, res: Response) => {
   const { id } = req.params;
   const { name, image } = req.body;

   const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, image },
      { new: true, runValidators: true }
   );

   if (!updatedBrand) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.OK).json(updatedBrand);
};
