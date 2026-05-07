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
   shippingAddress: z.object({
      address: z.string({ message: 'Address is required' }),
      city: z.string({ message: 'City is required' }),
      zipCode: z
         .string({ message: 'Zip code is required' })
         .regex(/^\d{5}$/, 'Zip code must be exactly 5 digits'),
   }),
   contactInfo: z.object({
      firstName: z.string({ message: 'First name is required' }),
      lastName: z.string({ message: 'Last name is required' }),
      email: z.string({ message: 'Email is required' }).email(),
      phone: z
         .string({ message: 'Phone is required' })
         .regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number format'),
   }),
   status: z
      .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .default('pending'),
});

export const createOrderSchema = orderSchema.omit({
   userId: true,
   totalAmount: true,
});

export type OrderInput = z.infer<typeof createOrderSchema>;
