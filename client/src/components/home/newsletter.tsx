'use client';

import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Newsletter() {
   return (
      <section className="container-px mx-auto w-full max-w-7xl pb-24">
         <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[3rem] px-8 py-16 text-center sm:px-16 lg:py-24 border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]"
            style={{ backgroundColor: 'hsl(var(--noir))' }}
         >
            {/* Background Texture Layers */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />

            <motion.div
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
               transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-[100px] pointer-events-none"
            />
            <motion.div
               animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
               transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
               }}
               className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/20 blur-[100px] pointer-events-none"
            />

            <div className="relative z-10 mx-auto max-w-2xl">
               <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                     duration: 0.6,
                     delay: 0.2,
                     ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-4xl font-black tracking-tight sm:text-6xl bg-clip-text text-transparent animate-gradient-x bg-linear-to-r from-white via-white/70 to-white"
               >
                  Join the Edge.
               </motion.h2>
               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                     duration: 0.6,
                     delay: 0.3,
                     ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-6 text-lg font-medium text-white/60 text-balance mx-auto max-w-lg"
               >
                  Stay updated with the latest tech drops, exclusive offers, and
                  pro-grade gear. Get 10% off your first order.
               </motion.p>

               <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                     duration: 0.6,
                     delay: 0.4,
                     ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center relative z-20"
               >
                  <div className="relative flex-1">
                     <input
                        type="email"
                        placeholder="Enter your email"
                        className="h-14 w-full rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-6 text-white outline-none transition-all duration-300 focus:border-accent/50 focus:bg-white/10 focus:shadow-[0_0_30px_hsl(var(--accent)/0.2)] placeholder:text-white/30"
                        required
                     />
                  </div>
                  <button
                     type="submit"
                     className="group flex h-14 items-center justify-center gap-2 rounded-full bg-accent px-8 font-bold text-accent-foreground shadow-glow transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_hsl(var(--accent)/0.5)]"
                  >
                     Subscribe
                     <Send className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
               </motion.form>

               <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-6 text-xs text-white/40"
               >
                  By subscribing, you agree to our Privacy Policy and Terms of
                  Service.
               </motion.p>
            </div>
         </motion.div>
      </section>
   );
}
