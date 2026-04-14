import { Router } from 'express';
import {
   createCategory,
   getCategories,
   getCategory,
   deleteCategory,
   updateCategory,
} from '../controllers/category.controller.js';
import { asyncHandler } from '../utils/async.handler.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { categorySchema } from '../schemas/category.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';

const categoryRoutes = Router();

categoryRoutes.get('/', asyncHandler(getCategories));
categoryRoutes.get(
   '/:id',
   validate(idParamSchema, 'params'),
   asyncHandler(getCategory)
);

categoryRoutes.use(protect, restrictTo('admin'));

categoryRoutes.post(
   '/',
   validate(categorySchema),
   asyncHandler(createCategory)
);
categoryRoutes.delete(
   '/:id',
   validate(idParamSchema, 'params'),
   asyncHandler(deleteCategory)
);
categoryRoutes.put(
   '/:id',
   validate(idParamSchema, 'params'),
   validate(categorySchema),
   asyncHandler(updateCategory)
);

export default categoryRoutes;
