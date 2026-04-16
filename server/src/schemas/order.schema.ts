import z from 'zod';

export const orderSchema = z.object({
   userId: z.string({ message: 'User ID is required' }),
   items: z.array(
      z.object({
         productId: z.string({ message: 'Product ID is required' }),
         quantity: z.number().min(1, 'Quantity must be at least 1'),
         price: z.number().min(0, 'Price must be non-negative'),
      })
   ),
   totalAmount: z.number().min(0),
   status: z
      .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .default('pending'),
});

export const createOrderSchema = orderSchema.omit({
   userId: true,
   totalAmount: true,
});

export type OrderInput = z.infer<typeof createOrderSchema>;
