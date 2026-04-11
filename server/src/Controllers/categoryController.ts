import type { Request, Response } from 'express';
import { HTTP_STATUS } from '../enums/httpStatus.js';
import Category from '../models/Category.js';

export const addCategory = async (req: Request, res: Response) => {
   try {
      const { name, image } = req.body;

      if (!name || !image) {
         return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Please provide all the required fields',
         });
      }

      const existingCategory = await Category.findOne({ name: name });

      if (existingCategory) {
         return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Category already exists.',
         });
      }

      const newCategory = await Category.create({ name, image });

      res.status(HTTP_STATUS.CREATED).json({
         success: true,
         message: 'Category added successfully',
         data: newCategory,
      });
   } catch (err: unknown) {
      console.log(err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
         success: false,
         message: 'Internal server error',
      });
   }
};

export const getAllCategories = async (req: Request, res: Response) => {
   try {
      const categories = await Category.find();

      res.status(HTTP_STATUS.OK).json({
         success: true,
         message: 'Categories fetched successfully',
         data: categories,
      });
   } catch (err: unknown) {
      console.log(err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
         success: false,
         message: 'Internal server error',
      });
   }
};

export const getCategoryById = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      const category = await Category.findById(id);

      if (!category) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: 'Category not found',
         });
      }

      res.status(HTTP_STATUS.OK).json({
         success: true,
         message: 'Category fetched successfully',
         data: category,
      });
   } catch (err: unknown) {
      console.log(err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
         success: false,
         message: 'Internal server error',
      });
   }
};

export const deleteCategory = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      const category = await Category.findById(id);

      if (!category) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: 'Category not found',
         });
      }

      await Category.findByIdAndDelete(id);

      res.status(HTTP_STATUS.OK).json({
         success: true,
         message: 'Category deleted successfully',
      });
   } catch (err: unknown) {
      console.log(err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
         success: false,
         message: 'Internal server error',
      });
   }
};

export const editCategory = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      const { name, image } = req.body;

      const category = await Category.findById(id);

      if (!category) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: 'Category not found',
         });
      }

      await Category.findByIdAndUpdate(id, { name, image });

      res.status(HTTP_STATUS.OK).json({
         success: true,
         message: 'Category updated successfully',
      });
   } catch (err: unknown) {
      console.log(err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
         success: false,
         message: 'Internal server error',
      });
   }
};
