import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
   createCheckoutSession,
   verifyPayment,
} from '../controllers/payment.controller.js';
import { asyncHandler } from '../utils/async.handler.js';

const paymentRouter = Router();

paymentRouter.use(protect);

paymentRouter.post(
   '/create-checkout-session',
   asyncHandler(createCheckoutSession)
);
paymentRouter.get('/verify/:sessionId', asyncHandler(verifyPayment));

export default paymentRouter;
