import z from 'zod';

const productSchema = z.object({
   name: z
      .string({ message: 'Name is required' })
      .min(2, 'Name must be at least 2 character'),
   price: z
      .number({ message: 'Price is required' })
      .min(0, 'Price must be non-negative'),
   description: z
      .string({ message: 'Description is required' })
      .min(1, 'Description must be at least 1 character'),
   image: z
      .string({ message: 'Image is required' })
      .min(1, 'Image must be at least 1 character'),
   categoryId: z
      .string({ message: 'Category is required' })
      .min(1, 'Category must be at least 1 character'),
   brandId: z
      .string({ message: 'Brand is required' })
      .min(1, 'Brand must be at least 1 character'),
   countInStock: z.number().min(0, 'Count in stock must be non-negative'),
   availability: z.boolean(),
   status: z.enum(['brandnew', 'used', 'refurbished']),
});

export default productSchema;
