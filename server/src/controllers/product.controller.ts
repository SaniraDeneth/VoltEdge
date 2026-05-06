import type { Request, Response, NextFunction } from 'express';
import Product from '../models/product.model.js';
import { HTTP_STATUS } from '../enums/http.status.js';

/**
 * Get all products with advanced filtering and pagination
 * @route GET /api/products
 */
export const getProducts = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const {
      limit,
      sort,
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      page,
      availability,
      status,
      newArrivals,
      specs,
   } = req.query;

   const andFilters: Record<string, unknown>[] = [];

   if (category) {
      andFilters.push({ categoryId: category });
   }

   if (brand) {
      andFilters.push({ brandId: brand });
   }

   if (search) {
      andFilters.push({ name: { $regex: search, $options: 'i' } });
   }

   if (availability) {
      andFilters.push({
         countInStock: availability === 'in-stock' ? { $gt: 0 } : { $eq: 0 },
      });
   }

   if (status) {
      andFilters.push({ status });
   }

   if (newArrivals === 'true') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      andFilters.push({ createdAt: { $gte: thirtyDaysAgo } });
   }

   if (specs) {
      const specPairs = (specs as string).split(',');
      const groupedSpecs: Record<string, string[]> = {};

      specPairs.forEach((pair) => {
         const [label, value] = pair.split(':');
         if (label && value) {
            if (!groupedSpecs[label]) groupedSpecs[label] = [];
            groupedSpecs[label].push(value);
         }
      });

      Object.entries(groupedSpecs).forEach(([label, values]) => {
         andFilters.push({
            specifications: {
               $elemMatch: {
                  label,
                  value: { $in: values },
               },
            },
         });
      });
   }

   if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      andFilters.push({ price: priceFilter });
   }

   const filter = andFilters.length > 0 ? { $and: andFilters } : {};

   const pageNum = parseInt(page as string) || 1;
   const limitNum = parseInt(limit as string) || 12;
   const skip = (pageNum - 1) * limitNum;

   const totalProducts = await Product.countDocuments(filter);
   const totalPages = Math.ceil(totalProducts / limitNum);

   const sortObj: Record<string, 1 | -1> = {};

   if (sort) {
      const sortStr = sort as string;
      const direction = sortStr.startsWith('-') ? -1 : 1;
      const field = sortStr.startsWith('-') ? sortStr.substring(1) : sortStr;
      sortObj[field] = direction;
   } else {
      sortObj.createdAt = -1;
   }

   const products = await Product.find(filter)
      .populate('categoryId')
      .populate('brandId')
      .sort({ ...sortObj, countInStock: -1 })
      .skip(skip)
      .limit(limitNum);

   return res.status(HTTP_STATUS.OK).json({
      products,
      pagination: {
         totalProducts,
         totalPages,
         currentPage: pageNum,
         limit: limitNum,
      },
   });
};

/**
 * Get product by ID
 * @route GET /api/products/:id
 */
export const getProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params;
   const product = await Product.findById(id)
      .populate('categoryId')
      .populate('brandId');

   if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
         message: 'Product not found',
      });
   }

   return res.status(HTTP_STATUS.OK).json(product);
};

/**
 * Add a new product
 * @route POST /api/products
 */
export const addProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const product = await Product.create(req.body);
   return res.status(HTTP_STATUS.CREATED).json(product);
};

/**
 * Update a product
 * @route PUT /api/products/:id
 */
export const editProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params;
   const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
   });

   if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
         message: 'Product not found',
      });
   }

   return res.status(HTTP_STATUS.OK).json(product);
};

/**
 * Delete a product
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { id } = req.params;
   const product = await Product.findByIdAndDelete(id);

   if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
         message: 'Product not found',
      });
   }

   return res.status(HTTP_STATUS.NO_CONTENT).send();
};
