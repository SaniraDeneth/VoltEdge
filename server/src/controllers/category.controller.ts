import type { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS } from '../enums/http.status.js';
import Category from '../models/category.model.js';
import { AppError } from '../utils/app.error.js';
import { z } from 'zod';
import { categorySchema } from '../schemas/category.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';
import {
   cleanupUploadedFiles,
   deleteImagesFromUrls,
} from '../middlewares/image.middleware.js';

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
   const categoryData = req.body as CategoryRequest;

   const existingCategory = await Category.findOne({ name: categoryData.name });
   if (existingCategory) {
      if (req.file) {
         await cleanupUploadedFiles(req.file);
      }
      throw new AppError(
         'Category already exists.',
         HTTP_STATUS.BAD_REQUEST,
         'ALREADY_EXISTS'
      );
   }

   try {
      const category = await Category.create(categoryData);
      return res.status(HTTP_STATUS.CREATED).json(category);
   } catch (error) {
      if (req.file) {
         await cleanupUploadedFiles(req.file);
      }
      throw error;
   }
};

export const deleteCategory = async (
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

   if (category.image) {
      await deleteImagesFromUrls(category.image);
   }

   await Category.findByIdAndDelete(id);

   return res.status(HTTP_STATUS.NO_CONTENT).send();
};

export const updateCategory = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;
   const updateData = req.body as CategoryRequest;

   try {
      const oldCategory = await Category.findById(id);
      if (!oldCategory) {
         if (req.file) {
            await cleanupUploadedFiles(req.file);
         }
         throw new AppError(
            'Category not found',
            HTTP_STATUS.NOT_FOUND,
            'NOT_FOUND'
         );
      }

      if (req.file && oldCategory.image) {
         await deleteImagesFromUrls(oldCategory.image);
      }

      const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
         new: true,
         runValidators: true,
      });

      return res.status(HTTP_STATUS.OK).json(updatedCategory);
   } catch (error) {
      if (req.file) {
         await cleanupUploadedFiles(req.file);
      }
      throw error;
   }
};
