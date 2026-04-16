import { Router } from 'express';
import {
   addProduct,
   deleteProduct,
   editProduct,
   getProduct,
   getProducts,
} from '../controllers/product.controller.js';
import { asyncHandler } from '../utils/async.handler.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import productSchema from '../schemas/product.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';
import { upload } from '../middlewares/upload.middleware.js';
import { processImages } from '../middlewares/image.middleware.js';

const productRoutes = Router();

productRoutes.get('/', asyncHandler(getProducts));
productRoutes.get(
   '/:id',
   validate(idParamSchema, 'params'),
   asyncHandler(getProduct)
);

productRoutes.use(protect, restrictTo('admin'));

productRoutes.post(
   '/',
   upload.array('images', 5),
   processImages,
   validate(productSchema),
   asyncHandler(addProduct)
);

productRoutes.put(
   '/:id',
   upload.array('images', 5),
   processImages,
   validate(idParamSchema, 'params'),
   validate(productSchema),
   asyncHandler(editProduct)
);

productRoutes.delete(
   '/:id',
   validate(idParamSchema, 'params'),
   asyncHandler(deleteProduct)
);

export default productRoutes;
