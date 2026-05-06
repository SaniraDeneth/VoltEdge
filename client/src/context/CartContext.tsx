'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { toast } from 'react-hot-toast';

interface CartContextType {
   cart: CartItem[];
   addToCart: (product: Product, quantity?: number) => void;
   removeFromCart: (productId: string) => void;
   updateQuantity: (productId: string, quantity: number) => void;
   clearCart: () => void;
   cartCount: number;
   cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
   const [cart, setCart] = useState<CartItem[]>([]);
   const [isInitialized, setIsInitialized] = useState(false);

   // Load cart from localStorage on mount
   useEffect(() => {
      const savedCart = localStorage.getItem('volt-edge-cart');
      if (savedCart) {
         try {
            setCart(JSON.parse(savedCart));
         } catch (error) {
            console.error('Failed to parse cart from localStorage', error);
         }
      }
      setIsInitialized(true);
   }, []);

   // Save cart to localStorage whenever it changes
   useEffect(() => {
      if (isInitialized) {
         localStorage.setItem('volt-edge-cart', JSON.stringify(cart));
      }
   }, [cart, isInitialized]);

   const addToCart = (product: Product, quantity: number = 1) => {
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
         const newQuantity = existingItem.quantity + quantity;
         if (newQuantity > product.countInStock) {
            toast.error(
               `Only ${product.countInStock} items available in stock`,
               {
                  id: 'stock-error',
               }
            );
            return;
         }
         setCart((prevCart) =>
            prevCart.map((item) =>
               item.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
            )
         );
         toast.success(`Updated ${product.name} quantity in cart!`);
      } else {
         if (product.countInStock < quantity) {
            toast.error(
               `Only ${product.countInStock} items available in stock`
            );
            return;
         }
         setCart((prevCart) => [...prevCart, { ...product, quantity }]);
         toast.success(`Added ${product.name} to cart!`);
      }
   };

   const removeFromCart = (productId: string) => {
      const itemToRemove = cart.find((item) => item.id === productId);
      if (itemToRemove) {
         setCart((prevCart) =>
            prevCart.filter((item) => item.id !== productId)
         );
         toast.success(`Removed ${itemToRemove.name} from cart`);
      }
   };

   const updateQuantity = (productId: string, quantity: number) => {
      if (quantity < 1) return;

      const item = cart.find((i) => i.id === productId);
      if (item && quantity > item.countInStock) {
         toast.error(`Only ${item.countInStock} items available in stock`, {
            id: 'stock-error',
         });
         return;
      }

      setCart((prevCart) =>
         prevCart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
         )
      );
   };

   const clearCart = () => {
      setCart([]);
      toast.success('Cart cleared');
   };

   const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
   const cartTotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   return (
      <CartContext.Provider
         value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
         }}
      >
         {children}
      </CartContext.Provider>
   );
}

export function useCart() {
   const context = useContext(CartContext);
   if (context === undefined) {
      throw new Error('useCart must be used within a CartProvider');
   }
   return context;
}
