import { z } from 'zod';

export const userSchema = z.object({
   name: z
      .string({ message: 'Name is required' })
      .min(2, 'Name must be at least 2 characters'),

   email: z
      .string({ message: 'Email is required' })
      .email('Please provide a valid email address'),

   password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),

   role: z.enum(['admin', 'user']).default('user'),
});

export type UserInput = z.infer<typeof userSchema>;
