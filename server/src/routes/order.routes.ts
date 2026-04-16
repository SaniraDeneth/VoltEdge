import { Router } from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import {
   createOrder,
   getOrders,
   getOrder,
   updateOrderStatus,
   cancelOrder,
} from '../controllers/order.controller.js';
import { asyncHandler } from '../utils/async.handler.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createOrderSchema } from '../schemas/order.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';

const orderRouter = Router();

orderRouter.use(protect);

orderRouter
   .route('/')
   .post(validate(createOrderSchema), asyncHandler(createOrder))
   .get(asyncHandler(getOrders));

orderRouter
   .route('/:id')
   .get(validate(idParamSchema, 'params'), asyncHandler(getOrder));

orderRouter.patch(
   '/:id/status',
   restrictTo('admin'),
   validate(idParamSchema, 'params'),
   asyncHandler(updateOrderStatus)
);

orderRouter.patch(
   '/:id/cancel',
   validate(idParamSchema, 'params'),
   asyncHandler(cancelOrder)
);

export default orderRouter;
