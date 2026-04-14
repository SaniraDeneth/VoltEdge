import type { NextFunction, Response } from 'express';
import { type ProtectedRequest } from '../middlewares/auth.middleware.js';
import { AppError } from '../utils/app.error.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import type { CartInput } from '../schemas/cart.schema.js';

export const createCart = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const userId = req.user.id;

   const existingCart = await Cart.findOne({ userId });
   if (existingCart) {
      throw new AppError(
         'Cart already exists',
         HTTP_STATUS.BAD_REQUEST,
         'BAD_REQUEST'
      );
   }

   const cart = await Cart.create({
      userId,
      items: [],
      totalAmount: 0,
   });

   return res.status(HTTP_STATUS.CREATED).json(cart);
};

export const getCart = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const userId = req.user.id;

   const cart = await Cart.findOne({ userId }).populate('items.productId');
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.OK).json(cart);
};

export const addToCart = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { productId, quantity } = req.body as CartInput;
   const userId = req.user.id;

   const product = await Product.findById(productId);
   if (!product) {
      throw new AppError(
         'Product not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   if (!product.availability) {
      throw new AppError(
         'This product is currently unavailable',
         HTTP_STATUS.BAD_REQUEST,
         'PRODUCT_UNAVAILABLE'
      );
   }

   let cart = await Cart.findOne({ userId });
   if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0 });
   }

   const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
   );

   const currentQuantity = itemIndex > -1 ? cart.items[itemIndex]!.quantity : 0;
   const newQuantity = currentQuantity + quantity;

   if (newQuantity > product.countInStock) {
      throw new AppError(
         `Only ${product.countInStock} items available in stock`,
         HTTP_STATUS.BAD_REQUEST,
         'OUT_OF_STOCK'
      );
   }

   if (itemIndex > -1) {
      cart.items[itemIndex]!.quantity = newQuantity;
      cart.items[itemIndex]!.price = product.price;
   } else {
      cart.items.push({
         productId: product._id,
         quantity,
         price: product.price,
      });
   }

   cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};

export const removeFromCart = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { productId, quantity } = req.body as CartInput;
   const userId = req.user.id;

   const cart = await Cart.findOne({ userId });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
   );

   if (itemIndex === -1) {
      throw new AppError(
         'Item not found in cart',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   cart.items[itemIndex]!.quantity -= quantity;

   if (cart.items[itemIndex]!.quantity <= 0) {
      cart.items.splice(itemIndex, 1);
   }

   cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};

export const removeItemFromCart = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { productId } = req.body as Pick<CartInput, 'productId'>;
   const userId = req.user.id;

   const cart = await Cart.findOne({ userId });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
   );

   cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};

export const updateCartItemQuantity = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { productId, quantity } = req.body as CartInput;
   const userId = req.user.id;

   const cart = await Cart.findOne({ userId });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
   );

   if (itemIndex === -1) {
      throw new AppError(
         'Item not found in cart',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
   } else {
      const product = await Product.findById(productId);
      if (!product) {
         throw new AppError(
            'Product not found',
            HTTP_STATUS.NOT_FOUND,
            'NOT_FOUND'
         );
      }

      if (quantity > product.countInStock) {
         throw new AppError(
            `Only ${product.countInStock} items available in stock`,
            HTTP_STATUS.BAD_REQUEST,
            'OUT_OF_STOCK'
         );
      }

      cart.items[itemIndex]!.quantity = quantity;
   }

   cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};

export const clearCart = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const userId = req.user.id;

   const cart = await Cart.findOne({ userId });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   cart.items = [];
   cart.totalAmount = 0;

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};
