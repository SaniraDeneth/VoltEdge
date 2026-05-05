const BASE_URL = 'http://localhost:5000/api';

export async function apiRequest<T>(
   endpoint: string,
   options: RequestInit = {}
): Promise<T> {
   const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
         'Content-Type': 'application/json',
         ...options.headers,
      },
   });

   if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Something went wrong');
   }

   return response.json();
}

import type { Product } from '@/types';

export const productsApi = {
   getById: (id: string) => apiRequest<Product>(`/products/${id}`),
   getAll: () => apiRequest<Product[]>('/products'),
};
