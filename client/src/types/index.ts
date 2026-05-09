export interface Product {
   id: string;
   name: string;
   price: number;
   description: string;
   images: string[];
   category?: Category;
   brand?: Brand;
   countInStock: number;
   status: string;
   availability?: boolean;
   sold?: number;
   specifications: Array<{
      label: string;
      value: string;
   }>;
   warranty: {
      duration: string;
      policy: string;
   };
}

export interface Category {
   id: string;
   name: string;
}

export interface Brand {
   id: string;
   name: string;
   image: string;
}

export interface CartItem extends Product {
   quantity: number;
}

export interface Pagination {
   totalPages: number;
   totalProducts: number;
   currentPage: number;
   limit: number;
}

export interface User {
   id: string;
   authProvider?: 'local' | 'google';
   name: string;
   email: string;
   role: 'user' | 'admin';
   avatar?: string;
   phone?: string;
   shippingAddress?: {
      address: string;
      city: string;
      zipCode: string;
   };
   createdAt: string;
}

export interface AuthResponse {
   user: User;
   token: string;
}

export interface BackendCartItem {
   productId: Product & { id: string; _id?: string };
   quantity: number;
   price: number;
}

export interface Cart {
   items: BackendCartItem[];
   totalAmount: number;
}

export interface OrderItem {
   productId: string | Product;
   quantity: number;
   price: number;
}

export interface OrderInput {
   items: OrderItem[];
   shippingAddress: {
      address: string;
      city: string;
      zipCode: string;
   };
   contactInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
   };
}

export interface Order extends OrderInput {
   id: string;
   userId: string;
   totalAmount: number;
   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
   createdAt: string;
}
