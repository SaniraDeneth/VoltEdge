import type { Request, Response } from 'express';
import { AppError } from '../utils/app.error.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import Product from '../models/product.model.js';

export const addProduct = async (req: Request, res: Response) => {
   const {
      name,
      description,
      price,
      categoryId,
      brandId,
      image,
      countInStock,
      availability,
      status,
   } = req.body;

   if (
      !name ||
      !description ||
      !price ||
      !categoryId ||
      !brandId ||
      !image ||
      !countInStock ||
      !availability ||
      !status
   ) {
      throw new AppError(
         'Please provide all the required fields',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

   const existingProduct = await Product.findOne({ name });
   if (existingProduct) {
      throw new AppError(
         'Product already exists.',
         HTTP_STATUS.BAD_REQUEST,
         'ALREADY_EXISTS'
      );
   }

   const product = await Product.create({
      name,
      description,
      price,
      categoryId,
      brandId,
      image,
      countInStock,
      availability,
      status,
   });

   return res.status(HTTP_STATUS.CREATED).json(product);
};

export const getProducts = async (req: Request, res: Response) => {
   const products = await Product.find();
   return res.status(HTTP_STATUS.OK).json(products);
};

export const getProduct = async (req: Request, res: Response) => {
   const { id } = req.params;

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

export const editProduct = async (req: Request, res: Response) => {
   const { id } = req.params;
   const {
      name,
      description,
      price,
      categoryId,
      brandId,
      image,
      countInStock,
      availability,
      status,
   } = req.body;

   const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
         name,
         description,
         price,
         categoryId,
         brandId,
         image,
         countInStock,
         availability,
         status,
      },
      { new: true, runValidators: true }
   );

   if (!updatedProduct) {
      throw new AppError(
         'Product not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   return res.status(HTTP_STATUS.OK).json(updatedProduct);
};

export const deleteProduct = async (req: Request, res: Response) => {
   const { id } = req.params;

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
