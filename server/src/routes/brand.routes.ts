import { Router } from 'express';
import {
   createBrand,
   deleteBrand,
   getBrand,
   getBrands,
   updateBrand,
} from '../controllers/brand.controller.js';
import { asyncHandler } from '../utils/async.handler.js';

const brandRoutes = Router();

brandRoutes.post('/', asyncHandler(createBrand));
brandRoutes.get('/', asyncHandler(getBrands));
brandRoutes.get('/:id', asyncHandler(getBrand));
brandRoutes.delete('/:id', asyncHandler(deleteBrand));
brandRoutes.put('/:id', asyncHandler(updateBrand));

export default brandRoutes;
