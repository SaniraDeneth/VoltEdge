import type { Request, Response } from 'express';
import { HTTP_STATUS } from '../enums/http.status.js';
import Brand from '../models/brand.model.js';

export const addBrand = async (req: Request, res: Response) => {
   const { name, image } = req.body;

   if (!name || !image) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
         success: false,
         message: 'Please provide all the required fields',
      });
   }

   const existingBrand = await Brand.findOne({ name: name });

   if (existingBrand) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
         success: false,
         message: 'Brand already exists.',
      });
   }

   const newBrand = await Brand.create({ name: name, image: image });

   return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Brand added successfully',
      data: newBrand,
   });
};

export const getAllBrands = async (req: Request, res: Response) => {
   const brands = await Brand.find();

   res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brands fetched successfully',
      data: brands,
   });
};

export const getBrandById = async (req: Request, res: Response) => {
   const { id } = req.params;

   const brand = await Brand.findById(id);

   if (!brand) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
         success: false,
         message: 'Brand not found',
      });
   }

   res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brand fetched successfully',
      data: brand,
   });
};

export const deleteBrand = async (req: Request, res: Response) => {
   const { id } = req.params;

   const brand = await Brand.findById(id);

   if (!brand) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
         success: false,
         message: 'Brand not found',
      });
   }

   await Brand.findByIdAndDelete(id);

   res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brand deleted successfully',
   });
};

export const editBrand = async (req: Request, res: Response) => {
   const { id } = req.params;

   const { name, image } = req.body;

   const brand = await Brand.findById(id);

   if (!brand) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
         success: false,
         message: 'Brand not found',
      });
   }

   await Brand.findByIdAndUpdate(id, { name, image });

   res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brand updated successfully',
   });
};
