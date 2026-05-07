'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, BackendCartItem } from '@/types';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { cartApi } from '@/lib/api-client';

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
   const { isAuthenticated } = useAuth();

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

   // Sync cart with backend when authentication status changes
   useEffect(() => {
      const syncWithServer = async () => {
         if (isAuthenticated && isInitialized) {
            try {
               const savedCart = localStorage.getItem('volt-edge-cart');
               const localItems = savedCart ? JSON.parse(savedCart) : [];

               if (localItems.length > 0) {
                  // Merge local cart with server
                  const itemsToMerge = localItems.map((item: CartItem) => ({
                     productId: item.id,
                     quantity: item.quantity,
                  }));
                  const response = await cartApi.merge(itemsToMerge);
                  const mappedCart = response.items.map(
                     (item: BackendCartItem) => ({
                        ...item.productId,
                        id: item.productId._id,
                        quantity: item.quantity,
                     })
                  );
                  setCart(mappedCart);
                  // Remove from localStorage after successful merge
                  localStorage.removeItem('volt-edge-cart');
                  toast.success('Your cart has been synced!');
               } else {
                  // Just fetch server cart
                  const response = await cartApi.get();
                  const mappedCart = response.items.map(
                     (item: BackendCartItem) => ({
                        ...item.productId,
                        id: item.productId._id,
                        quantity: item.quantity,
                     })
                  );
                  setCart(mappedCart);
               }
            } catch (error) {
               console.error('Cart sync failed', error);
            }
         }
      };

      syncWithServer();
   }, [isAuthenticated, isInitialized]);

   // Clear cart state on logout
   useEffect(() => {
      if (!isAuthenticated && isInitialized) {
         setCart([]);
         localStorage.removeItem('volt-edge-cart');
      }
   }, [isAuthenticated, isInitialized]);

   // Save cart to localStorage whenever it changes (only for guest)
   useEffect(() => {
      if (isInitialized && !isAuthenticated) {
         localStorage.setItem('volt-edge-cart', JSON.stringify(cart));
      }
   }, [cart, isInitialized, isAuthenticated]);

   const addToCart = async (product: Product, quantity: number = 1) => {
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
         if (isAuthenticated) {
            await cartApi.addItem({ productId: product.id, quantity });
         }
         toast.success(`Updated ${product.name} quantity in cart!`);
      } else {
         if (product.countInStock < quantity) {
            toast.error(
               `Only ${product.countInStock} items available in stock`
            );
            return;
         }
         setCart((prevCart) => [...prevCart, { ...product, quantity }]);
         if (isAuthenticated) {
            await cartApi.addItem({ productId: product.id, quantity });
         }
         toast.success(`Added ${product.name} to cart!`);
      }
   };

   const removeFromCart = async (productId: string) => {
      const itemToRemove = cart.find((item) => item.id === productId);
      if (itemToRemove) {
         setCart((prevCart) =>
            prevCart.filter((item) => item.id !== productId)
         );
         if (isAuthenticated) {
            await cartApi.removeItem(productId);
         }
         toast.success(`Removed ${itemToRemove.name} from cart`);
      }
   };

   const updateQuantity = async (productId: string, quantity: number) => {
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

      if (isAuthenticated) {
         await cartApi.updateQuantity({ productId, quantity });
      }
   };

   const clearCart = async () => {
      setCart([]);
      if (isAuthenticated) {
         await cartApi.clear();
      }
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
