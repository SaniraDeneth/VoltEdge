import { z } from 'zod';

export const idParamSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: 'Invalid ID format',
   }),
});
