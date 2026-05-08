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
      const message =
         errorData.error?.message ||
         errorData.message ||
         'Something went wrong';
      throw new Error(message);
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
   Cart,
   Order,
   OrderInput,
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
   googleLogin: (credential: string) =>
      apiRequest<AuthResponse>('/users/social-auth', {
         method: 'POST',
         body: JSON.stringify({ credential }),
      }),
   getMe: () => apiRequest<User>('/users/me'),
   updateProfile: (data: Partial<User>) =>
      apiRequest<User>('/users/profile', {
         method: 'PATCH',
         body: JSON.stringify(data),
      }),
   getAll: () => apiRequest<User[]>('/users'),
};

export const adminApi = {
   getStats: () =>
      apiRequest<{
         totalRevenue: number;
         revenueChange: number;
         totalOrders: number;
         ordersChange: number;
         totalProducts: number;
         totalUsers: number;
         usersChange: number;
         recentOrders: Order[];
      }>('/admin/stats'),
};

export const cartApi = {
   get: () => apiRequest<Cart>('/cart'),
   addItem: (data: { productId: string; quantity: number }) =>
      apiRequest<Cart>('/cart/add', {
         method: 'POST',
         body: JSON.stringify(data),
      }),
   updateQuantity: (data: { productId: string; quantity: number }) =>
      apiRequest<Cart>('/cart/update-quantity', {
         method: 'POST',
         body: JSON.stringify(data),
      }),
   removeItem: (productId: string) =>
      apiRequest<Cart>('/cart/remove-item', {
         method: 'POST',
         body: JSON.stringify({ productId }),
      }),
   clear: () =>
      apiRequest<Cart>('/cart/clear', {
         method: 'POST',
      }),
   merge: (items: { productId: string; quantity: number }[]) =>
      apiRequest<Cart>('/cart/merge', {
         method: 'POST',
         body: JSON.stringify({ items }),
      }),
};

export const paymentApi = {
   createCheckoutSession: (
      items: { productId: string; quantity: number }[],
      orderId: string,
      fromCart?: boolean
   ) =>
      apiRequest<{ url: string }>('/payments/create-checkout-session', {
         method: 'POST',
         body: JSON.stringify({ items, orderId, fromCart }),
      }),
   verifyPayment: (sessionId: string) =>
      apiRequest<{ success: boolean; status: string; fromCart?: boolean }>(
         `/payments/verify/${sessionId}`
      ),
};

export const ordersApi = {
   create: (data: OrderInput) =>
      apiRequest<Order>('/orders', {
         method: 'POST',
         body: JSON.stringify(data),
      }),
   getAll: () => apiRequest<Order[]>('/orders'),
   getById: (id: string) => apiRequest<Order>(`/orders/${id}`),
   cancel: (id: string) =>
      apiRequest<Order>(`/orders/${id}/cancel`, {
         method: 'PATCH',
      }),
};
