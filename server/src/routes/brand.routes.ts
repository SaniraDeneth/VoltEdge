import { Router } from 'express';
import {
   createBrand,
   deleteBrand,
   getBrand,
   getBrands,
   updateBrand,
} from '../controllers/brand.controller.js';
import { asyncHandler } from '../utils/async.handler.js';
import { brandSchema } from '../schemas/brand.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { processImages } from '../middlewares/image.middleware.js';

const brandRoutes = Router();

brandRoutes.get('/', asyncHandler(getBrands));
brandRoutes.get(
   '/:id',
   validate(idParamSchema, 'params'),
   asyncHandler(getBrand)
);

brandRoutes.use(protect, restrictTo('admin'));

brandRoutes.post(
   '/',
   upload.single('image'),
   processImages,
   validate(brandSchema),
   asyncHandler(createBrand)
);

brandRoutes.delete(
   '/:id',
   validate(idParamSchema, 'params'),
   asyncHandler(deleteBrand)
);

brandRoutes.put(
   '/:id',
   upload.single('image'),
   processImages,
   validate(idParamSchema, 'params'),
   validate(brandSchema),
   asyncHandler(updateBrand)
);

export default brandRoutes;
