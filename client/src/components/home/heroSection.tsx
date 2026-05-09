'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function HeroSection() {
   const [mounted, setMounted] = useState(false);
   const containerRef = useRef<HTMLElement>(null);

   useEffect(() => {
      setMounted(true);
   }, []);

   const { scrollY } = useScroll();

   const yPhone = useTransform(scrollY, [0, 800], [0, -800]);
   const xLeft = useTransform(scrollY, [0, 800], [0, -400]);
   const xRight = useTransform(scrollY, [0, 800], [0, 400]);
   const yBottom = useTransform(scrollY, [0, 800], [0, 400]);
   const opacityFast = useTransform(scrollY, [0, 600], [1, 0]);

   const scaleText = useTransform(scrollY, [0, 800, 1600], [1, 1, 0.95]);
   const opacityText = useTransform(scrollY, [1200, 1600], [1, 0]);

   if (!mounted) {
      return (
         <section
            ref={containerRef}
            className="relative h-[200vh] w-full bg-(image:--gradient-hero)"
         >
            <div className="sticky top-0 h-screen w-full" />
         </section>
      );
   }

   return (
      <section
         ref={containerRef}
         className="relative h-[200vh] w-full bg-(image:--gradient-hero)"
      >
         <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden pt-15">
            <div className="absolute inset-0 bg-grid z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-noise opacity-[0.15] mix-blend-overlay z-0 pointer-events-none" />

            <motion.div
               animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
               transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] h-[40vw] w-[60vw] rounded-full bg-accent/30 blur-[120px] pointer-events-none z-0"
            />
            <motion.div
               animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
               transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
               }}
               className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] h-[20vw] w-[30vw] rounded-full bg-accent-glow/40 blur-[80px] pointer-events-none z-0"
            />

            <div className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col justify-center z-10">
               {/* TOP CORNERS */}
               <div className="absolute left-0 top-12 z-40 flex w-full justify-between px-6 lg:px-8">
                  <motion.div
                     style={{ x: xLeft, opacity: opacityFast }}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.1,
                     }}
                  >
                     <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-5 py-2 text-xs font-bold text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all hover:bg-white/30 cursor-default">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                           New · iPhone 17 Pro
                        </span>
                     </div>
                  </motion.div>

                  <motion.div
                     style={{ x: xRight, opacity: opacityFast }}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.1,
                     }}
                  >
                     <Link
                        href="/product/iphone-17-pro"
                        className="group hover-lift flex items-center gap-2 rounded-full bg-foreground px-7 py-2.5 text-sm font-black text-background shadow-[0_0_40px_hsl(var(--foreground)/0.15)] transition-all hover:bg-noir hover:shadow-[0_0_60px_hsl(var(--foreground)/0.25)]"
                     >
                        BUY NOW
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                     </Link>
                  </motion.div>
               </div>

               {/* MAIN HERO TEXT */}
               <motion.div
                  style={{ scale: scaleText, opacity: opacityText }}
                  className="relative z-10 flex flex-col text-center -translate-y-12 lg:-translate-y-20 pointer-events-none"
               >
                  <motion.h1
                     initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                     animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                     transition={{
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.7,
                     }}
                     className="font-display text-[15vw] font-black leading-[0.85] tracking-tighter bg-clip-text text-transparent animate-gradient-x bg-linear-to-r from-foreground via-muted-foreground to-foreground lg:text-[11vw] 2xl:text-[13rem]"
                  >
                     UNLIMITED
                  </motion.h1>
                  <motion.h1
                     initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                     animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                     transition={{
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.8,
                     }}
                     className="font-display text-[15vw] font-black leading-[0.9] tracking-tighter text-transparent drop-shadow-lg lg:text-[11vw] 2xl:text-[13rem]"
                     style={{
                        WebkitTextStroke: '1.5px hsl(var(--foreground) / 0.25)',
                     }}
                  >
                     POWER
                  </motion.h1>
               </motion.div>

               {/* PHONE */}
               <motion.div
                  style={{ y: yPhone, opacity: opacityFast }}
                  className="absolute left-1/2 top-1/2 z-30 w-[65vw] max-w-[320px] -translate-x-1/2 -translate-y-[55%] sm:w-[45vw] lg:max-w-[420px]"
               >
                  <motion.img
                     initial={{
                        opacity: 0,
                        scale: 0.8,
                        rotate: -15,
                        y: 40,
                        filter: 'blur(10px)',
                     }}
                     animate={{
                        opacity: 0.95,
                        scale: 0.9,
                        rotate: -10,
                        y: 0,
                        filter: 'blur(0px)',
                     }}
                     transition={{
                        duration: 1.4,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.3,
                     }}
                     whileHover={{
                        scale: 0.95,
                        rotate: -5,
                        opacity: 1,
                        filter: 'blur(0px)',
                        transition: { duration: 0.4, ease: 'easeOut' },
                     }}
                     src="/hero-phone.png"
                     alt="iPhone 15 Pro"
                     className="h-auto w-full origin-center"
                     style={{
                        filter:
                           'drop-shadow(20px 30px 40px rgba(0,0,0,0.35)) drop-shadow(0 0 80px hsl(var(--accent) / 0.3))',
                     }}
                  />
               </motion.div>

               {/* BOTTOM CORNERS */}
               <motion.div
                  style={{ y: yBottom, opacity: opacityFast }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                     duration: 0.8,
                     ease: [0.16, 1, 0.3, 1],
                     delay: 0.2,
                  }}
                  className="absolute bottom-8 left-0 z-40 flex w-full flex-col justify-between gap-6 px-6 lg:px-8 lg:flex-row lg:items-end"
               >
                  <div className="flex flex-col">
                     <span className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                        Aluminum Design
                     </span>
                     <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                        iPhone 17 Pro
                     </h2>
                  </div>

                  <div className="max-w-[280px] lg:text-right">
                     <p className="text-balance text-sm font-medium text-muted-foreground">
                        Forged in titanium and aluminum.{' '}
                        <br className="hidden lg:block" />
                        A19 Pro chip. A monster win for gaming.
                     </p>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>
   );
}
