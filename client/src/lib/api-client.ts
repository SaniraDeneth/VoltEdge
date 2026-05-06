const BASE_URL = 'http://localhost:5000/api';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
   refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
   refreshSubscribers.map((cb) => cb(token));
   refreshSubscribers = [];
}

export async function apiRequest<T>(
   endpoint: string,
   options: RequestInit = {}
): Promise<T> {
   const token =
      typeof window !== 'undefined'
         ? localStorage.getItem('volt-edge-token')
         : null;

   const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
         ...options.headers,
      },
   });

   // Handle 401 Unauthorized - attempt silent refresh
   if (
      response.status === 401 &&
      !endpoint.includes('/users/login') &&
      !endpoint.includes('/users/refresh')
   ) {
      if (!isRefreshing) {
         isRefreshing = true;
         try {
            const refreshResponse = await fetch(`${BASE_URL}/users/refresh`, {
               method: 'POST',
               credentials: 'include',
            });

            if (refreshResponse.ok) {
               const { token: newToken } = await refreshResponse.json();
               localStorage.setItem('volt-edge-token', newToken);
               isRefreshing = false;
               onTokenRefreshed(newToken);

               // Retry the original request
               return apiRequest<T>(endpoint, options);
            } else {
               // Refresh failed
               isRefreshing = false;
               localStorage.removeItem('volt-edge-token');
               if (
                  typeof window !== 'undefined' &&
                  !window.location.pathname.startsWith('/login')
               ) {
                  window.location.href = '/login';
               }
            }
         } catch (error) {
            isRefreshing = false;
            throw error;
         }
      } else {
         // Queue requests while refreshing
         return new Promise((resolve) => {
            subscribeTokenRefresh(() => {
               resolve(apiRequest<T>(endpoint, options));
            });
         });
      }
   }

   if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Something went wrong');
   }

   return response.json();
}

import type {
   Product,
   Category,
   Brand,
   Pagination,
   User,
   AuthResponse,
} from '@/types';

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

export const authApi = {
   login: (data: Record<string, string>) =>
      apiRequest<AuthResponse>('/users/login', {
         method: 'POST',
         body: JSON.stringify(data),
      }),
   register: (data: Record<string, string>) =>
      apiRequest<AuthResponse>('/users/register', {
         method: 'POST',
         body: JSON.stringify(data),
      }),
   refresh: () =>
      apiRequest<{ token: string }>('/users/refresh', {
         method: 'POST',
      }),
   logout: () =>
      apiRequest<{ message: string }>('/users/logout', {
         method: 'POST',
      }),
   getMe: () => apiRequest<User>('/users/me'),
};
