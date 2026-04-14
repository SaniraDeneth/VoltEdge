import type { Response, Request, NextFunction } from 'express';
import { AppError } from '../utils/app.error.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import Product from '../models/product.model.js';
import { z } from 'zod';
import productSchema from '../schemas/product.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';

type ProductRequest = z.infer<typeof productSchema>;
type IdParam = z.infer<typeof idParamSchema>;

export const getProducts = async (
   _req: Request,
   res: Response,
   _next: NextFunction
) => {
   const products = await Product.find();
   return res.status(HTTP_STATUS.OK).json(products);
};

export const getProduct = async (
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
      throw new AppError(
         'Product with this name already exists',
         HTTP_STATUS.BAD_REQUEST,
         'ALREADY_EXISTS'
      );
   }

   const product = await Product.create(productData);

   return res.status(HTTP_STATUS.CREATED).json(product);
};

export const editProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;
   const updateData = req.body as ProductRequest;

   const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
   });

   if (!updatedProduct) {
      throw new AppError(
         'Product not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   return res.status(HTTP_STATUS.OK).json(updatedProduct);
};

export const deleteProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;

   const deletedProduct = await Product.findByIdAndDelete(id);
   if (!deletedProduct) {
      throw new AppError(
         'Product not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   return res.status(HTTP_STATUS.NO_CONTENT).send();
};
