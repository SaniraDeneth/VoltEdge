import { Router } from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { getStats } from '../controllers/admin.controller.js';
import { asyncHandler } from '../utils/async.handler.js';

const adminRoutes = Router();

adminRoutes.use(protect, restrictTo('admin'));

adminRoutes.get('/stats', asyncHandler(getStats));

export default adminRoutes;
