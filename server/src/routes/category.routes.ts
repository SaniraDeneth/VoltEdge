import { Router } from 'express';
import {
   createCategory,
   deleteCategory,
   getCategories,
   getCategory,
   updateCategory,
} from '../controllers/category.controller.js';
import { asyncHandler } from '../utils/async.handler.js';

const categoryRoutes = Router();

categoryRoutes.post('/', asyncHandler(createCategory));
categoryRoutes.get('/', asyncHandler(getCategories));
categoryRoutes.get('/:id', asyncHandler(getCategory));
categoryRoutes.delete('/:id', asyncHandler(deleteCategory));
categoryRoutes.put('/:id', asyncHandler(updateCategory));

export default categoryRoutes;
