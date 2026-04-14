import type { Request, Response } from 'express';
import { AppError } from '../utils/app.error.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

interface ICartItem {
   productId: string;
   quantity: number;
   price: number;
}

export const createCart = async (req: Request, res: Response) => {
   const { userId } = req.body;

   if (!userId) {
      throw new AppError(
         'User ID is required',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

   const user = await User.findById(userId);
   if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   const cart = await Cart.create({
      userId,
      items: [],
      totalAmount: 0,
   });

   return res.status(HTTP_STATUS.CREATED).json(cart);
};

export const getCart = async (req: Request, res: Response) => {
   const { userId } = req.params;

   const cart = await Cart.findOne({ userId: userId as string });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.OK).json(cart);
};

export const addToCart = async (req: Request, res: Response) => {
   const { userId, productId, quantity } = req.body;

   if (!userId || !productId || !quantity) {
      throw new AppError(
         'Please provide all required fields',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

   const product = await Product.findById(productId);
   if (!product) {
      throw new AppError(
         'Product not found',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   let cart = await Cart.findOne({ userId: userId as string });
   if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0 });
   }

   const cartItems = cart!.items as unknown as ICartItem[];
   const itemIndex = cartItems.findIndex(
      (item) => item.productId.toString() === (productId as string)
   );

   if (itemIndex > -1) {
      cartItems[itemIndex]!.quantity += quantity;
      cartItems[itemIndex]!.price = product.price as number;
   } else {
      cartItems.push({
         productId: productId as string,
         quantity,
         price: product.price as number,
      });
   }

   cart!.totalAmount = cartItems.reduce(
      (total: number, item: ICartItem) => total + item.price * item.quantity,
      0
   );

   await cart!.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};

export const removeFromCart = async (req: Request, res: Response) => {
   const { userId, productId, quantity } = req.body;

   if (!userId || !productId || !quantity) {
      throw new AppError(
         'Missing required fields',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

   const cart = await Cart.findOne({ userId });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   const cartItems = cart.items as unknown as ICartItem[];
   const itemIndex = cartItems.findIndex(
      (item) => item.productId.toString() === productId
   );

   if (itemIndex === -1) {
      throw new AppError(
         'Item not found in cart',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   cartItems[itemIndex]!.quantity -= quantity;

   if (cartItems[itemIndex]!.quantity <= 0) {
      cartItems.splice(itemIndex, 1);
   }

   cart.totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};

export const removeItemFromCart = async (req: Request, res: Response) => {
   const { userId, productId } = req.body;

   if (!userId || !productId) {
      throw new AppError(
         'User ID and Product ID are required',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

   const cart = await Cart.findOne({ userId });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   const cartItems = cart.items as unknown as ICartItem[];
   const initialLength = cartItems.length;

   const updatedItems = cartItems.filter(
      (item) => item.productId.toString() !== productId
   );

   if (initialLength === updatedItems.length) {
      throw new AppError(
         'Item not found in cart',
         HTTP_STATUS.NOT_FOUND,
         'NOT_FOUND'
      );
   }

   cart.items = updatedItems as unknown as ICartItem[];
   cart.totalAmount = updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};

export const updateCartItemQuantity = async (req: Request, res: Response) => {
   const { userId, productId, quantity } = req.body;

   if (!userId || !productId || quantity === undefined) {
      throw new AppError(
         'Missing required fields',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

   const cart = await Cart.findOne({ userId });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   const cartItems = cart.items as unknown as ICartItem[];
   const itemIndex = cartItems.findIndex(
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
      cartItems.splice(itemIndex, 1);
   } else {
      cartItems[itemIndex]!.quantity = quantity;
   }

   cart.totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};

export const clearCart = async (req: Request, res: Response) => {
   const { userId } = req.params;

   const cart = await Cart.findOne({ userId: userId as string });
   if (!cart) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   cart.items = [];
   cart.totalAmount = 0;

   await cart.save();
   return res.status(HTTP_STATUS.OK).json(cart);
};
