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
import Stripe from 'stripe';
import { ENV } from '../config/env.js';

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
   apiVersion: '2026-04-22.dahlia',
});

type IdParam = z.infer<typeof idParamSchema>;

export const createOrder = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { items, shippingAddress, contactInfo } = req.body as OrderInput;

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
      shippingAddress,
      contactInfo,
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
   const { status, search } = req.query as { status?: string; search?: string };

   const filter: { userId?: string; status?: string; _id?: string } = {};
   if (role !== 'admin') {
      filter.userId = userId;
   } else {
      if (status) {
         filter.status = status;
      }
      if (search && search.match(/^[0-9a-fA-F]{24}$/)) {
         filter._id = search;
      }
   }

   let orders = await Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

   // Filter by customer name or email in-memory if search is not a valid ObjectId
   if (search && !search.match(/^[0-9a-fA-F]{24}$/) && role === 'admin') {
      const searchLower = search.toLowerCase();
      orders = orders.filter((order) => {
         const user = order.userId as unknown as {
            name?: string;
            email?: string;
         };
         return (
            (user?.name && user.name.toLowerCase().includes(searchLower)) ||
            (user?.email && user.email.toLowerCase().includes(searchLower))
         );
      });
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
      'name images'
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

   if (order.status !== 'pending' && order.status !== 'processing') {
      throw new AppError(
         'Only pending or processing orders can be cancelled',
         HTTP_STATUS.BAD_REQUEST,
         'INVALID_STATUS'
      );
   }

   const originalStatus = order.status;
   order.status = 'cancelled';
   await order.save();

   // Trigger Stripe Refund if the order was paid (processing)
   if (originalStatus === 'processing' && order.paymentIntentId) {
      try {
         await stripe.refunds.create({
            payment_intent: order.paymentIntentId,
         });
         console.log(
            `Stripe refund successfully triggered for Order ${order._id}`
         );
      } catch (refundErr) {
         console.error(
            `Stripe refund failed for Order ${order._id}:`,
            refundErr
         );
      }
   }

   for (const item of order.items) {
      const updateObj: { $inc: { countInStock: number; sold?: number } } = {
         $inc: { countInStock: item.quantity },
      };

      // Only decrement sold count if the order was paid (processing)
      if (originalStatus === 'processing') {
         updateObj.$inc.sold = -item.quantity;
      }

      await Product.findByIdAndUpdate(item.productId, updateObj);
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

   if (status === 'processing' || status === 'pending') {
      throw new AppError(
         'Cannot manually set order status to pending or processing. These are managed automatically through client payment checkout.',
         HTTP_STATUS.BAD_REQUEST,
         'INVALID_STATUS'
      );
   }

   const order = await Order.findById(id);

   if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   if (order.status === 'cancelled') {
      throw new AppError(
         'Cannot update status of a cancelled order',
         HTTP_STATUS.BAD_REQUEST,
         'INVALID_STATUS'
      );
   }

   const originalStatus = order.status;
   order.status = status as
      | 'pending'
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled';
   await order.save();

   // Trigger Stripe Refund and stock restoration if admin manually cancels a paid order
   if (status === 'cancelled') {
      // Trigger Stripe Refund if the order was paid (processing, shipped, or delivered)
      if (originalStatus !== 'pending' && order.paymentIntentId) {
         try {
            await stripe.refunds.create({
               payment_intent: order.paymentIntentId,
            });
            console.log(
               `[Admin Cancel] Stripe refund successfully triggered by Admin for Order ${order._id}`
            );
         } catch (refundErr) {
            console.error(
               `[Admin Cancel] Stripe refund failed for Order ${order._id}:`,
               refundErr
            );
         }
      }

      // Restore stock levels and decrement sold metrics
      for (const item of order.items) {
         const updateObj: { $inc: { countInStock: number; sold?: number } } = {
            $inc: { countInStock: item.quantity },
         };

         // Only decrement sold count if the order was paid (not pending)
         if (originalStatus !== 'pending') {
            updateObj.$inc.sold = -item.quantity;
         }

         await Product.findByIdAndUpdate(item.productId, updateObj);
      }
   }

   return res.status(HTTP_STATUS.OK).json(order);
};

export const deleteOrder = async (
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

   if (order.userId.toString() !== userId && req.user.role !== 'admin') {
      throw new AppError(
         'You do not have permission to delete this order',
         HTTP_STATUS.FORBIDDEN,
         'FORBIDDEN'
      );
   }

   if (order.status !== 'pending') {
      throw new AppError(
         'Only pending orders can be deleted',
         HTTP_STATUS.BAD_REQUEST,
         'INVALID_STATUS'
      );
   }

   // Restore stock
   for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
         $inc: { countInStock: item.quantity },
      });
   }

   await Order.findByIdAndDelete(id);
   return res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Order deleted successfully' });
};
