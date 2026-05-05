export interface Product {
   id: string;
   name: string;
   price: number;
   description: string;
   images: string[];
   category: { id: string; name: string };
   brand: { id: string; name: string; image: string };
   countInStock: number;
   availability: boolean;
   status: 'brandnew' | 'used' | 'refurbished';
   specifications: { label: string; value: string }[];
   warranty: {
      duration: string;
      policy: string;
   };
}
