'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Truck, CreditCard, ShoppingBag } from 'lucide-react';

interface CheckoutProgressProps {
   currentStep: number;
}

const steps = [
   { icon: ShoppingBag, label: 'Cart' },
   { icon: Truck, label: 'Shipping' },
   { icon: CreditCard, label: 'Payment' },
];

export default function CheckoutProgress({
   currentStep,
}: CheckoutProgressProps) {
   return (
      <div className="mb-16 w-full max-w-2xl mx-auto">
         <div className="grid grid-cols-3 relative">
            {steps.map((Step, index) => {
               const isActive = index <= currentStep;
               const isCompleted = index < currentStep;

               return (
                  <div
                     key={Step.label}
                     className="flex flex-col items-center relative z-10"
                  >
                     {/* Connector Line (Behind) */}
                     {index < steps.length - 1 && (
                        <div className="absolute top-6 left-[50%] w-full h-0.5 -translate-y-1/2 bg-white/5 -z-10" />
                     )}

                     {/* Animated Progress Line Segment */}
                     {index < currentStep && (
                        <motion.div
                           initial={{ scaleX: 0 }}
                           animate={{ scaleX: 1 }}
                           transition={{ duration: 0.5, delay: index * 0.2 }}
                           className="absolute top-6 left-[50%] w-full h-0.5 -translate-y-1/2 bg-blue-500 -z-10 origin-left shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        />
                     )}

                     <motion.div
                        initial={false}
                        animate={{
                           scale: isActive ? 1.1 : 1,
                           backgroundColor: isCompleted
                              ? '#3b82f6'
                              : isActive
                                ? '#1e293b'
                                : '#0f172a',
                           borderColor: isActive ? '#3b82f6' : '#1e293b',
                        }}
                        className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-300 shadow-xl`}
                     >
                        {isCompleted ? (
                           <Check className="h-6 w-6 text-white" />
                        ) : (
                           <Step.icon
                              className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-slate-500'}`}
                           />
                        )}

                        {isActive && !isCompleted && (
                           <motion.div
                              layoutId="pulse"
                              className="absolute inset-0 rounded-full bg-blue-500/20"
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                           />
                        )}
                     </motion.div>

                     <div className="mt-4 text-center">
                        <p
                           className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground/40'}`}
                        >
                           {Step.label}
                        </p>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
