import { Router } from 'express';
import {
   addCategory,
   deleteCategory,
   editCategory,
   getAllCategories,
   getCategoryById,
} from '../controllers/category.controller.js';
import { asyncHandler } from '../utils/async.handler.js';

const categoryRoutes = Router();

categoryRoutes.post('/', asyncHandler(addCategory));
categoryRoutes.get('/', asyncHandler(getAllCategories));
categoryRoutes.get('/:name', asyncHandler(getCategoryById));
categoryRoutes.delete('/:id', asyncHandler(deleteCategory));
categoryRoutes.put('/:id', asyncHandler(editCategory));

export default categoryRoutes;
