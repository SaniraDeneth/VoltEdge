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

const cartRoutes = Router();

cartRoutes.post('/', asyncHandler(createCart));
cartRoutes.post('/add', asyncHandler(addToCart));
cartRoutes.post('/remove', asyncHandler(removeFromCart));
cartRoutes.post('/remove-item', asyncHandler(removeItemFromCart));
cartRoutes.post('/update-quantity', asyncHandler(updateCartItemQuantity));
cartRoutes.post('/clear/:userId', asyncHandler(clearCart));
cartRoutes.get('/:userId', asyncHandler(getCart));

export default cartRoutes;
