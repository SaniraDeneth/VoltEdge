import type { Response, Request, NextFunction } from 'express';
import { AppError } from '../utils/app.error.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import Product from '../models/product.model.js';
import { z } from 'zod';
import productSchema from '../schemas/product.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';
import {
   cleanupUploadedFiles,
   deleteImagesFromUrls,
} from '../middlewares/image.middleware.js';

type ProductRequest = z.infer<typeof productSchema>;
type IdParam = z.infer<typeof idParamSchema>;

export const getProducts = async (
   _req: Request,
   res: Response,
   _next: NextFunction
) => {
   const products = await Product.find()
      .populate('category', 'name')
      .populate('brand', 'name');
   return res.status(HTTP_STATUS.OK).json(products);
};

export const getProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;

   const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('brand', 'name');
   if (!product) {
      throw new AppError(
         'Product not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   return res.status(HTTP_STATUS.OK).json(product);
};

export const addProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const productData = req.body as ProductRequest;

   const existingProduct = await Product.findOne({ name: productData.name });
   if (existingProduct) {
      if (req.files) {
         await cleanupUploadedFiles(req.files as Express.Multer.File[]);
      }
      throw new AppError(
         'Product with this name already exists',
         HTTP_STATUS.BAD_REQUEST,
         'ALREADY_EXISTS'
      );
   }

   try {
      const product = await Product.create(productData);
      return res.status(HTTP_STATUS.CREATED).json(product);
   } catch (error) {
      if (req.files) {
         await cleanupUploadedFiles(req.files as Express.Multer.File[]);
      }
      throw error;
   }
};

export const editProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;
   const updateData = req.body as ProductRequest;

   try {
      const oldProduct = await Product.findById(id);
      if (!oldProduct) {
         if (req.files) {
            await cleanupUploadedFiles(req.files as Express.Multer.File[]);
         }
         throw new AppError(
            'Product not found',
            HTTP_STATUS.NOT_FOUND,
            'NOT_FOUND'
         );
      }

      const imagesToDelete = oldProduct.images.filter(
         (oldUrl) => !updateData.images.includes(oldUrl)
      );

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
         new: true,
      });

      if (imagesToDelete.length > 0) {
         await deleteImagesFromUrls(imagesToDelete);
      }

      return res.status(HTTP_STATUS.OK).json(updatedProduct);
   } catch (error) {
      if (req.files) {
         await cleanupUploadedFiles(req.files as Express.Multer.File[]);
      }
      throw error;
   }
};

export const deleteProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;

   const product = await Product.findById(id);
   if (!product) {
      throw new AppError(
         'Product not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   if (product.images && product.images.length > 0) {
      await deleteImagesFromUrls(product.images);
   }

   await Product.findByIdAndDelete(id);

   return res.status(HTTP_STATUS.NO_CONTENT).send();
};
