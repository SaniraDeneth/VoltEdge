import { Router } from 'express';
import {
   createCart,
   getCart,
   addToCart,
   removeFromCart,
   removeItemFromCart,
   updateCartItemQuantity,
   clearCart,
} from '../controllers/cart.controller.js';
import { asyncHandler } from '../utils/async.handler.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addToCartSchema } from '../schemas/cart.schema.js';

const cartRoutes = Router();

cartRoutes.use(protect);

cartRoutes.post('/', asyncHandler(createCart));
cartRoutes.post('/add', validate(addToCartSchema), asyncHandler(addToCart));
cartRoutes.post(
   '/remove',
   validate(addToCartSchema),
   asyncHandler(removeFromCart)
);
cartRoutes.post(
   '/update-quantity',
   validate(addToCartSchema),
   asyncHandler(updateCartItemQuantity)
);
cartRoutes.post('/remove-item', asyncHandler(removeItemFromCart));
cartRoutes.post('/clear', asyncHandler(clearCart));
cartRoutes.get('/', asyncHandler(getCart));

export default cartRoutes;
