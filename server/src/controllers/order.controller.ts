import type { Response, NextFunction } from 'express';
import type { ProtectedRequest } from '../middlewares/auth.middleware.js';
import type { OrderInput } from '../schemas/order.schema.js';
import { AppError } from '../utils/app.error.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';
import { idParamSchema } from '../schemas/common.schema.js';
import type { z } from 'zod';

type IdParam = z.infer<typeof idParamSchema>;

export const createOrder = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { items } = req.body as OrderInput;

   if (!items || items.length === 0) {
      throw new AppError('No order items', HTTP_STATUS.BAD_REQUEST, 'NO_ITEMS');
   }

   const productIds = items.map((item) => item.productId);
   const productsFromDb = await Product.find({ _id: { $in: productIds } });

   const orderItems = items.map((item) => {
      const product = productsFromDb.find(
         (p) => p._id.toString() === item.productId
      );

      if (!product) {
         throw new AppError(
            `Product not found: ${item.productId}`,
            HTTP_STATUS.NOT_FOUND,
            'PRODUCT_NOT_FOUND'
         );
      }

      if (product.countInStock < item.quantity) {
         throw new AppError(
            `Insufficient stock for product: ${product.name}`,
            HTTP_STATUS.BAD_REQUEST,
            'OUT_OF_STOCK'
         );
      }

      return {
         productId: item.productId,
         quantity: item.quantity,
         price: product.price,
      };
   });

   const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
   );

   const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
   });

   for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
         $inc: { countInStock: -item.quantity },
      });
   }

   const cart = await Cart.findOne({ userId: req.user.id });
   if (cart) {
      cart.items = cart.items.filter(
         (cartItem) =>
            !orderItems.some(
               (orderItem) =>
                  orderItem.productId === cartItem.productId.toString()
            )
      );

      cart.totalAmount = cart.items.reduce(
         (total, item) => total + item.price * item.quantity,
         0
      );

      await cart.save();
   }

   return res.status(HTTP_STATUS.CREATED).json(order);
};

export const getOrders = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { id: userId, role } = req.user;

   let orders;
   if (role === 'admin') {
      orders = await Order.find()
         .populate('userId', 'name email')
         .sort({ createdAt: -1 });
   } else {
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
   }

   return res.status(HTTP_STATUS.OK).json(orders);
};

export const getOrder = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;
   const { id: userId, role } = req.user;

   const order = await Order.findById(id).populate(
      'items.productId',
      'name image'
   );

   if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   if (role !== 'admin' && order.userId.toString() !== userId) {
      throw new AppError(
         'You do not have permission to access this order',
         HTTP_STATUS.FORBIDDEN,
         'FORBIDDEN'
      );
   }

   return res.status(HTTP_STATUS.OK).json(order);
};

export const cancelOrder = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;
   const userId = req.user.id;

   const order = await Order.findById(id);

   if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   if (order.userId.toString() !== userId) {
      throw new AppError(
         'You do not have permission to cancel this order',
         HTTP_STATUS.FORBIDDEN,
         'FORBIDDEN'
      );
   }

   if (order.status !== 'pending') {
      throw new AppError(
         'Only pending orders can be cancelled',
         HTTP_STATUS.BAD_REQUEST,
         'INVALID_STATUS'
      );
   }

   order.status = 'cancelled';
   await order.save();

   for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
         $inc: { countInStock: item.quantity },
      });
   }

   return res.status(HTTP_STATUS.OK).json(order);
};

export const updateOrderStatus = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params as IdParam;
   const { status } = req.body as { status: string };

   const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

   if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.OK).json(order);
};
