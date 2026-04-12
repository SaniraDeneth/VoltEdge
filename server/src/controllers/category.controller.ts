import type { Request, Response } from 'express';
import { HTTP_STATUS } from '../enums/http.status.js';
import Category from '../models/category.model.js';
import { AppError } from '../utils/app.error.js';

export const createCategory = async (req: Request, res: Response) => {
   const { name, image } = req.body;

   if (!name || !image) {
      throw new AppError(
         'Please provide all the required fields',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

   const existingCategory = await Category.findOne({ name });
   if (existingCategory) {
      throw new AppError(
         'Category already exists.',
         HTTP_STATUS.BAD_REQUEST,
         'ALREADY_EXISTS'
      );
   }

   const category = await Category.create({ name, image });

   return res.status(HTTP_STATUS.CREATED).json(category);
};

export const getCategories = async (req: Request, res: Response) => {
   const categories = await Category.find();
   return res.status(HTTP_STATUS.OK).json(categories);
};

export const getCategory = async (req: Request, res: Response) => {
   const { id } = req.params;

   const category = await Category.findById(id);
   if (!category) {
      throw new AppError(
         'Category not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   return res.status(HTTP_STATUS.OK).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
   const { id } = req.params;

   const deleted = await Category.findByIdAndDelete(id);
   if (!deleted) {
      throw new AppError(
         'Category not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   return res.status(HTTP_STATUS.NO_CONTENT).send();
};

export const updateCategory = async (req: Request, res: Response) => {
   const { id } = req.params;
   const { name, image } = req.body;

   const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image },
      { new: true, runValidators: true }
   );

   if (!updatedCategory) {
      throw new AppError(
         'Category not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   return res.status(HTTP_STATUS.OK).json(updatedCategory);
};
