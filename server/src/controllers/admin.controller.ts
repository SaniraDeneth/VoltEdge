import type { Response, NextFunction } from 'express';
import type { ProtectedRequest } from '../middlewares/auth.middleware.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

export const getStats = async (
   _req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const now = new Date();
   const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
   const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

   const [
      totalRevenueData,
      lastMonthRevenueData,
      totalOrders,
      lastMonthOrders,
      totalProducts,
      totalUsers,
      lastMonthUsers,
      recentOrders,
   ] = await Promise.all([
      // Current Total Revenue
      Order.aggregate([
         {
            $match: { status: { $in: ['processing', 'shipped', 'delivered'] } },
         },
         { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      // Last Month Revenue (for growth calculation)
      Order.aggregate([
         {
            $match: {
               status: { $in: ['processing', 'shipped', 'delivered'] },
               createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
            },
         },
         { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      // Total Orders (Paid checkouts)
      Order.countDocuments({
         status: { $in: ['processing', 'shipped', 'delivered'] },
      }),
      // Last Month Orders (Paid checkouts)
      Order.countDocuments({
         status: { $in: ['processing', 'shipped', 'delivered'] },
         createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
      }),
      // Total Products
      Product.countDocuments(),
      // Total Normal Users
      User.countDocuments({ role: 'user' }),
      // Last Month Normal Users
      User.countDocuments({
         role: 'user',
         createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
      }),
      // Recent Orders (Include paid checkouts)
      Order.find({ status: { $in: ['processing', 'shipped', 'delivered'] } })
         .populate('userId', 'name email')
         .sort({ createdAt: -1 })
         .limit(5),
   ]);

   const currentMonthRevenue = await Order.aggregate([
      {
         $match: {
            status: { $in: ['processing', 'shipped', 'delivered'] },
            createdAt: { $gte: startOfCurrentMonth },
         },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
   ]);

   const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
   };

   const revChange = calculateChange(
      currentMonthRevenue[0]?.total || 0,
      lastMonthRevenueData[0]?.total || 0
   );

   const currentMonthOrders = await Order.countDocuments({
      status: { $in: ['processing', 'shipped', 'delivered'] },
      createdAt: { $gte: startOfCurrentMonth },
   });
   const orderChange = calculateChange(currentMonthOrders, lastMonthOrders);

   const currentMonthUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfCurrentMonth },
   });
   const userChange = calculateChange(currentMonthUsers, lastMonthUsers);

   const stats = {
      totalRevenue: totalRevenueData[0]?.total || 0,
      revenueChange: revChange,
      totalOrders,
      ordersChange: orderChange,
      totalProducts,
      totalUsers,
      usersChange: userChange,
      recentOrders,
   };

   return res.status(HTTP_STATUS.OK).json(stats);
};
