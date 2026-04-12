import { Router } from 'express';
import {
   addBrand,
   deleteBrand,
   editBrand,
   getAllBrands,
   getBrandById,
} from '../controllers/brand.controller.js';
import { asyncHandler } from '../utils/async.handler.js';

const brandRoutes = Router();

brandRoutes.post('/', asyncHandler(addBrand));
brandRoutes.get('/', asyncHandler(getAllBrands));
brandRoutes.get('/:id', asyncHandler(getBrandById));
brandRoutes.delete('/:id', asyncHandler(deleteBrand));
brandRoutes.put('/:id', asyncHandler(editBrand));

export default brandRoutes;
