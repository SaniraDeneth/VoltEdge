'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
   ShoppingBag,
   CreditCard,
   ArrowLeft,
   Loader2,
   ArrowRight,
} from 'lucide-react';
import { CartItem } from '@/types';
import Image from 'next/image';

interface ShippingData {
   firstName: string;
   lastName: string;
   email: string;
   address: string;
   city: string;
   zipCode: string;
   phone: string;
}

interface OrderSummaryProps {
   cart: CartItem[];
   total: number;
   shippingData: ShippingData;
   onBack: () => void;
   onPay: () => Promise<void>;
}

export default function OrderSummary({
   cart,
   total,
   shippingData,
   onBack,
   onPay,
}: OrderSummaryProps) {
   const [isProcessing, setIsProcessing] = useState(false);

   const handlePayment = async () => {
      setIsProcessing(true);
      try {
         await onPay();
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         exit={{ opacity: 0, x: -20 }}
         className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
         {/* Order Details */}
         <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="font-display text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-accent" />
                  Your Items
               </h3>
               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                  {cart.map((item) => (
                     <div
                        key={item.id}
                        className="flex gap-5 p-4 rounded-3xl bg-background border border-border/40 hover:border-accent/30 transition-colors group"
                     >
                        <div className="relative w-24 h-24 bg-surface rounded-2xl overflow-hidden flex-shrink-0 border border-border/20">
                           <Image
                              src={item.images[0] || '/placeholder.png'}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                           />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                           <h4 className="text-foreground font-bold text-lg truncate mb-1">
                              {item.name}
                           </h4>
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                 Qty: {item.quantity}
                              </span>
                              <div className="w-1 h-1 bg-border rounded-full" />
                              <p className="text-accent font-bold tracking-tight">
                                 $
                                 {(item.price * item.quantity).toLocaleString()}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="font-display text-xl font-bold text-foreground mb-6">
                  Shipping To
               </h3>
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
                        Recipient
                     </p>
                     <p className="text-foreground font-bold text-lg">
                        {shippingData.firstName} {shippingData.lastName}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                        Contact
                     </p>
                     <p className="text-foreground font-medium">
                        {shippingData.phone}
                     </p>
                  </div>
                  <div className="col-span-2 space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
                        Recipient
                     </p>
                     <p className="text-foreground font-medium leading-relaxed">
                        {shippingData.address}
                        <br />
                        {shippingData.city}, {shippingData.zipCode}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Payment Summary */}
         <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-32 space-y-6">
               <div className="bg-surface/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] -mr-16 -mt-16 rounded-full transition-transform duration-700 group-hover:scale-150" />

                  <h3 className="font-display text-2xl font-bold mb-8 relative z-10 text-foreground">
                     Summary
                  </h3>
                  <div className="space-y-5 relative z-10">
                     <div className="flex justify-between text-muted-foreground font-medium">
                        <span>Subtotal</span>
                        <span className="font-bold text-foreground">
                           ${total.toLocaleString()}
                        </span>
                     </div>
                     <div className="flex justify-between text-muted-foreground font-medium">
                        <span>Shipping</span>
                        <span className="text-emerald-500 font-black tracking-[0.2em] text-[10px] uppercase">
                           FREE
                        </span>
                     </div>
                     <div className="h-px bg-border/30 my-6" />
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-muted-foreground/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                              Total Amount
                           </p>
                           <p className="font-display text-5xl font-black tracking-tighter text-accent">
                              ${total.toLocaleString()}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <button
                     disabled={isProcessing}
                     onClick={handlePayment}
                     className="group relative w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground py-5 font-black uppercase tracking-widest text-background transition-all hover:bg-noir hover:shadow-2xl active:scale-[0.98]"
                  >
                     <span className="relative z-10 flex items-center justify-center gap-3">
                        {isProcessing ? (
                           <>
                              <Loader2 className="w-6 h-6 animate-spin" />
                              Processing...
                           </>
                        ) : (
                           <>
                              <CreditCard className="w-6 h-6" />
                              Pay Now
                              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                           </>
                        )}
                     </span>
                     {/* Shimmer effect */}
                     <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                  <button
                     disabled={isProcessing}
                     onClick={onBack}
                     className="w-full bg-surface hover:bg-muted text-foreground border border-border font-bold py-5 rounded-full transition-all flex items-center justify-center gap-2"
                  >
                     <ArrowLeft className="w-5 h-5" />
                     Back to Details
                  </button>
               </div>

               <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-muted/30">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                     Secure Stripe Payment Active
                  </p>
               </div>
            </div>
         </div>
      </motion.div>
   );
}
