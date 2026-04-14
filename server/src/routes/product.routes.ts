import { Router } from 'express';
import {
   addProduct,
   deleteProduct,
   editProduct,
   getProduct,
   getProducts,
} from '../controllers/product.controller.js';
import { asyncHandler } from '../utils/async.handler.js';

const productRoutes = Router();

productRoutes.post('/', asyncHandler(addProduct));
productRoutes.put('/:id', asyncHandler(editProduct));
productRoutes.get('/', asyncHandler(getProducts));
productRoutes.get('/:id', asyncHandler(getProduct));
productRoutes.delete('/:id', asyncHandler(deleteProduct));

export default productRoutes;
