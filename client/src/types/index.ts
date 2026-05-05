export interface Product {
   id: string;
   name: string;
   price: number;
   description: string;
   images: string[];
   category?: {
      id: string;
      name: string;
   };
   brand?: {
      id: string;
      name: string;
   };
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
