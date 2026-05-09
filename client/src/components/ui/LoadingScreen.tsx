'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen() {
   return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
         {/* Background Grid Pattern for high-tech premium feel */}
         <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
         <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay pointer-events-none" />

         {/* Ambient soft background glows optimized for light mode */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-accent/8 blur-[80px] pointer-events-none" />
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[150px] w-[150px] rounded-full bg-accent-glow/10 blur-[50px] pointer-events-none" />

         <div className="relative flex flex-col items-center gap-8">
            {/* Spinning/pulsing neon ring logo */}
            <div className="relative flex items-center justify-center">
               {/* Pulsing Accent Ring */}
               <motion.div
                  animate={{
                     scale: [1, 1.15, 1],
                     opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                     duration: 2,
                     repeat: Infinity,
                     ease: 'easeInOut',
                  }}
                  className="absolute h-24 w-24 rounded-full border border-accent/30 shadow-[0_0_30px_rgba(37,99,235,0.08)]"
               />

               {/* Rotating Segment Ring */}
               <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                     duration: 1.5,
                     repeat: Infinity,
                     ease: 'linear',
                  }}
                  className="h-20 w-20 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent"
               />

               {/* Center Icon */}
               <div className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 border border-slate-200/80 backdrop-blur-xl shadow-xs">
                  <Sparkles className="h-6 w-6 text-accent animate-pulse" />
               </div>
            </div>

            {/* Logo Text Animation */}
            <div className="flex flex-col items-center gap-2 text-center">
               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="flex items-center gap-1 font-display text-2xl font-black tracking-widest text-slate-900"
               >
                  <span>VOLT</span>
                  <span className="text-accent bg-linear-to-r from-accent to-accent-glow bg-clip-text text-transparent">
                     EDGE
                  </span>
               </motion.div>

               {/* Subtle modern parsing bar */}
               <div className="h-[2px] w-24 overflow-hidden rounded-full bg-slate-100 mt-1">
                  <motion.div
                     animate={{
                        x: ['-100%', '100%'],
                     }}
                     transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                     }}
                     className="h-full w-12 bg-linear-to-r from-accent to-accent-glow"
                  />
               </div>

               <motion.p
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-2"
               >
                  Initializing Performance Grid
               </motion.p>
            </div>
         </div>
      </div>
   );
}
