'use client';

import React from 'react';
import Link from 'next/link';
import {
   Minus,
   Plus,
   Trash2,
   ShoppingBag,
   ArrowLeft,
   ArrowRight,
   ShieldCheck,
   Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
   const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } =
      useCart();

   if (cart.length === 0) {
      return (
         <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-surface shadow-inner"
            >
               <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
            </motion.div>
            <h1 className="mb-2 font-display text-4xl font-bold tracking-tight">
               Your cart is empty
            </h1>
            <p className="mb-8 text-muted-foreground">
               Looks like you haven't added anything to your cart yet.
            </p>
            <Link
               href="/products"
               className="group flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 font-bold text-background transition-all hover:bg-noir hover:shadow-lg active:scale-95"
            >
               <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
               Start Shopping
            </Link>
         </div>
      );
   }

   return (
      <div className="mx-auto w-full max-w-7xl px-6 pt-28 pb-20 lg:px-8">
         {/* Page Header */}
         <div className="mb-12">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
               Shopping Bag
            </h1>
            <p className="mt-2 text-muted-foreground">
               {cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag
            </p>
         </div>

         {/* Main Layout — standard 12-column grid */}
         <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* ─── Cart Items ─── */}
            <div className="lg:col-span-7">
               <div className="space-y-5">
                  <AnimatePresence mode="popLayout">
                     {cart.map((item, index) => (
                        <motion.div
                           key={item.id}
                           layout
                           initial={{ opacity: 0, y: 16 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, x: -20, scale: 0.96 }}
                           transition={{ delay: index * 0.04 }}
                           className="group relative flex flex-col gap-5 rounded-[2rem] border border-border/40 bg-surface/30 p-5 backdrop-blur-sm transition-all hover:bg-surface/60 hover:shadow-md sm:flex-row sm:items-center"
                        >
                           {/* Image */}
                           <Link
                              href={`/products/${item.id}`}
                              className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl border border-border/30 bg-white sm:h-32 sm:w-32 cursor-pointer"
                           >
                              <img
                                 src={item.images[0]}
                                 alt={item.name}
                                 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                           </Link>

                           {/* Info */}
                           <div className="flex flex-1 flex-col justify-between py-1">
                              <div className="flex items-start justify-between gap-4">
                                 <Link
                                    href={`/products/${item.id}`}
                                    className="group/name cursor-pointer"
                                 >
                                    <h3 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover/name:text-accent">
                                       {item.name}
                                    </h3>
                                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                                       {item.category?.name || 'Accessories'}
                                    </p>
                                 </Link>
                                 <p className="font-display text-xl font-bold tabular-nums">
                                    ${item.price.toLocaleString()}
                                 </p>
                              </div>

                              <div className="mt-6 flex items-center justify-between">
                                 {/* Qty stepper */}
                                 <div
                                    className="flex items-center gap-1 rounded-xl border border-border/50 bg-background/60 p-1"
                                    onClick={(e) => e.stopPropagation()}
                                 >
                                    <button
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          updateQuantity(
                                             item.id,
                                             item.quantity - 1
                                          );
                                       }}
                                       disabled={item.quantity <= 1}
                                       className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                       <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold">
                                       {item.quantity}
                                    </span>
                                    <button
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          updateQuantity(
                                             item.id,
                                             item.quantity + 1
                                          );
                                       }}
                                       className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-surface"
                                    >
                                       <Plus className="h-3 w-3" />
                                    </button>
                                 </div>

                                 {/* Remove */}
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       removeFromCart(item.id);
                                    }}
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-muted-foreground/50 transition-all hover:bg-rose-50 hover:text-rose-500"
                                    title="Remove item"
                                 >
                                    <Trash2 className="h-5 w-5" />
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>

               {/* Trust strip */}
               <div className="mt-10 flex flex-wrap items-center gap-6 rounded-3xl border border-border/20 bg-surface/20 px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                     <Truck className="h-4 w-4 text-accent" /> Free Shipping
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                     <ShieldCheck className="h-4 w-4 text-accent" /> Secure
                     Checkout
                  </div>
               </div>
            </div>

            {/* ─── Order Summary ─── */}
            <div className="lg:col-span-5">
               <div className="sticky top-28 rounded-[2.5rem] border border-border/50 bg-surface/40 p-8 shadow-xl backdrop-blur-xl">
                  <h2 className="mb-5 font-display text-2xl font-bold tracking-tight">
                     Order Summary
                  </h2>

                  {/* Line items */}
                  <div className="space-y-3 border-b border-border/30 pb-5">
                     <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Subtotal ({cartCount} items)</span>
                        <span className="font-bold text-foreground">
                           ${cartTotal.toLocaleString()}
                        </span>
                     </div>
                     <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Shipping</span>
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-500">
                           Free
                        </span>
                     </div>
                     <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Estimated Tax</span>
                        <span className="font-bold text-foreground">$0.00</span>
                     </div>
                  </div>

                  {/* Total */}
                  <div className="mt-5 flex items-end justify-between">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                        Total Amount
                     </p>
                     <span className="font-display text-4xl font-black tracking-tighter text-accent">
                        ${cartTotal.toLocaleString()}
                     </span>
                  </div>

                  {/* CTA */}
                  <button className="group relative mt-7 flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground py-4 font-black uppercase tracking-widest text-background transition-all hover:bg-noir hover:shadow-2xl active:scale-[0.98]">
                     <span className="relative z-10 flex items-center gap-3">
                        Proceed to Checkout
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                     </span>
                     {/* Shimmer effect */}
                     <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>

                  <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/40">
                     Taxes and shipping calculated at checkout
                  </p>

                  {/* Payment badges */}
                  <div className="mt-6 flex items-center justify-center gap-6 opacity-25 grayscale filter">
                     <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                        className="h-4"
                        alt="Visa"
                     />
                     <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        className="h-6"
                        alt="Mastercard"
                     />
                     <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                        className="h-5"
                        alt="PayPal"
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
