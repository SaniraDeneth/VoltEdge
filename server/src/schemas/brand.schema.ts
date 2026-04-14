import { z } from 'zod';

export const brandSchema = z.object({
   name: z.string().min(2, 'Brand name must be at least 2 characters'),
   image: z.string().url('Please provide a valid image URL'),
});

export type BrandInput = z.infer<typeof brandSchema>;
