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

import type { Product, Category, Brand, Pagination } from '@/types';

export const productsApi = {
   getById: (id: string) => apiRequest<Product>(`/products/${id}`),
   getAll: (params?: Record<string, string | number | boolean>) => {
      const queryString = params
         ? `?${new URLSearchParams(
              Object.entries(params)
                 .filter(([, v]) => v !== undefined && v !== null && v !== '')
                 .map(([k, v]) => [k, String(v)])
           ).toString()}`
         : '';
      return apiRequest<{ products: Product[]; pagination: Pagination }>(
         `/products${queryString}`
      );
   },
};

export const categoriesApi = {
   getAll: () => apiRequest<Category[]>('/categories'),
};

export const brandsApi = {
   getAll: () => apiRequest<Brand[]>('/brands'),
};
