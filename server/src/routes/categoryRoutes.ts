import { Router } from 'express';
import {
   addCategory,
   deleteCategory,
   editCategory,
   getAllCategories,
   getCategoryById,
} from '../Controllers/categoryController.js';

const categoryRoutes = Router();

categoryRoutes.post('/', addCategory);
categoryRoutes.get('/', getAllCategories);
categoryRoutes.get('/:name', getCategoryById);
categoryRoutes.delete('/:id', deleteCategory);
categoryRoutes.put('/:id', editCategory);

export default categoryRoutes;
