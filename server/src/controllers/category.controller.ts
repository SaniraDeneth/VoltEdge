import type { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS } from '../enums/http.status.js';
import Category from '../models/category.model.js';
import { AppError } from '../utils/app.error.js';
import { z } from 'zod';
import { categorySchema } from '../schemas/category.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';

type CategoryRequest = z.infer<typeof categorySchema>;
type IdParam = z.infer<typeof idParamSchema>;

export const getCategories = async (
   _req: Request,
   res: Response,
   _next: NextFunction
) => {
   const categories = await Category.find();
   return res.status(HTTP_STATUS.OK).json(categories);
};

export const getCategory = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;

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

export const createCategory = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { name, image } = req.body as CategoryRequest;

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

export const deleteCategory = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;

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

export const updateCategory = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;
   const { name, image } = req.body as CategoryRequest;

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
