'use client';

import React, { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
   CheckCircle2,
   Package,
   ArrowRight,
   Share2,
   Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { paymentApi } from '@/lib/api-client';

function SuccessContent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const sessionId = searchParams.get('session_id');
   const { clearCart, cart } = useCart();
   const [verifying, setVerifying] = React.useState(true);
   const [error, setError] = React.useState(false);

   useEffect(() => {
      const verify = async () => {
         if (sessionId) {
            try {
               const response = await paymentApi.verifyPayment(sessionId);
               if (response.success) {
                  setVerifying(false);
                  if (response.fromCart && cart.length > 0) {
                     clearCart();
                  }
               } else {
                  setError(true);
                  setVerifying(false);
               }
            } catch (err) {
               console.error('Verification error:', err);
               setError(true);
               setVerifying(false);
            }
         } else {
            setVerifying(false);
         }
      };

      verify();

      if (sessionId) {
         const duration = 5 * 1000;
         const animationEnd = Date.now() + duration;
         const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0,
         };
         const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

         const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({
               ...defaults,
               particleCount,
               origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
               ...defaults,
               particleCount,
               origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
         }, 250);

         return () => clearInterval(interval);
      }
   }, [sessionId, clearCart, cart]);

   if (verifying) {
      return (
         <main className="min-h-screen bg-gradient-hero flex items-center justify-center">
            <div className="text-center space-y-4">
               <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto" />
               <p className="text-foreground font-black text-[10px] tracking-[0.2em] uppercase">
                  Verifying Payment...
               </p>
            </div>
         </main>
      );
   }

   if (error) {
      return (
         <main className="min-h-screen bg-gradient-hero flex items-center justify-center px-6">
            <div className="text-center space-y-6 max-w-md w-full">
               <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                  <span className="text-red-500 text-5xl font-black">!</span>
               </div>
               <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-foreground uppercase tracking-tight">
                     Verification Failed
                  </h1>
                  <p className="text-muted-foreground font-medium">
                     We couldn't verify your payment session. If you have been
                     charged, please contact our support with your Session ID.
                  </p>
               </div>
               <div className="p-4 bg-surface/50 backdrop-blur-xl rounded-2xl border border-border font-mono text-xs text-muted-foreground break-all">
                  Session: {sessionId}
               </div>
               <button
                  onClick={() => router.push('/')}
                  className="group relative w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground py-5 font-black uppercase tracking-widest text-background transition-all hover:bg-noir hover:shadow-2xl active:scale-[0.98]"
               >
                  <span className="relative z-10">Back to Shop</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
               </button>
            </div>
         </main>
      );
   }

   return (
      <main className="min-h-screen bg-gradient-hero flex items-center justify-center pt-28 pb-20 px-6">
         <div className="max-w-2xl w-full">
            <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: 'spring', damping: 15 }}
               className="bg-surface/60 backdrop-blur-3xl border border-white rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/10 blur-[100px] -z-10" />

               <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
               >
                  <div className="relative inline-block mb-10">
                     <div className="absolute inset-0 bg-accent blur-3xl opacity-20 animate-pulse" />
                     <CheckCircle2 className="w-24 h-24 text-accent relative z-10" />
                  </div>

                  <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight uppercase">
                     Order <span className="text-accent italic">Confirmed</span>
                  </h1>
                  <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
                     Your payment was processed securely. We've sent a
                     confirmation email with your receipt and tracking details.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={() => router.push('/orders')}
                        className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground py-4 font-black uppercase tracking-widest text-background transition-all hover:bg-noir hover:shadow-2xl active:scale-[0.98]"
                     >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                           <Package className="w-5 h-5" />
                           Track Order
                        </span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                     </button>
                     <button
                        onClick={() => router.push('/')}
                        className="w-full bg-surface hover:bg-muted text-foreground border border-border font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
                     >
                        Continue Shop
                        <ArrowRight className="w-5 h-5" />
                     </button>
                  </div>
               </motion.div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1 }}
               className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-6"
            >
               <button
                  onClick={() => {
                     const shareData = {
                        title: 'VoltEdge Purchase',
                        text: `Just upgraded my tech at VoltEdge! Order #${sessionId?.slice(-8).toUpperCase() || 'VOLT'}`,
                        url: window.location.origin,
                     };

                     if (navigator.share) {
                        navigator.share(shareData).catch(console.error);
                     } else {
                        navigator.clipboard.writeText(
                           `${shareData.text} - ${shareData.url}`
                        );
                        alert('Order details copied to clipboard!');
                     }
                  }}
                  className="flex items-center gap-3 bg-surface/40 backdrop-blur-xl border border-border/50 px-6 py-3 rounded-full hover:bg-surface/80 hover:border-accent/30 hover:text-accent transition-all font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground group"
               >
                  <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Share Purchase
               </button>
               <div className="hidden sm:block w-1 h-1 bg-border rounded-full" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                  Order ID: {sessionId?.slice(-8).toUpperCase() || 'VOLT-TEST'}
               </p>
            </motion.div>
         </div>
      </main>
   );
}

export default function SuccessPage() {
   return (
      <Suspense
         fallback={
            <main className="min-h-screen bg-gradient-hero flex items-center justify-center">
               <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </main>
         }
      >
         <SuccessContent />
      </Suspense>
   );
}
