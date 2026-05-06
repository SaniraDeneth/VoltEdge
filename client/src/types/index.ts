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
   name: string;
   email: string;
   role: 'user' | 'admin';
   createdAt: string;
}

export interface AuthResponse {
   user: User;
   token: string;
}
