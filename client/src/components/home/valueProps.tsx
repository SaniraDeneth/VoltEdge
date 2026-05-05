'use client';

import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const props = [
   {
      icon: Truck,
      title: 'Free Express Shipping',
      description: 'On all orders over $999.',
   },
   {
      icon: ShieldCheck,
      title: 'Secure Payments',
      description: 'Fully encrypted transaction protocols.',
   },
   {
      icon: Headphones,
      title: '24/7 Premium Support',
      description: 'Dedicated tech experts at your service.',
   },
   {
      icon: RefreshCw,
      title: 'Easy 30-Day Returns',
      description: 'No questions asked return policy.',
   },
];

const containerVariants: Variants = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1,
         delayChildren: 0.1,
      },
   },
};

const itemVariants: Variants = {
   hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
   visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
         duration: 0.8,
         ease: [0.16, 1, 0.3, 1],
      },
   },
};

export default function ValueProps() {
   return (
      <section className="relative w-full py-20 overflow-hidden">
         <div className="absolute inset-0 bg-grid opacity-50 z-0 pointer-events-none" />
         <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background z-0 pointer-events-none" />

         <div className="relative container-px mx-auto max-w-7xl z-10">
            <motion.div
               variants={containerVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: '-50px' }}
               className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
               {props.map((prop, index) => (
                  <motion.div
                     variants={itemVariants}
                     key={index}
                     className="flex flex-col items-center gap-5 p-8 text-center rounded-4xl border border-white/20 bg-surface/50 shadow-lg backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:bg-surface hover:shadow-xl group"
                  >
                     <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] bg-background shadow-sm border border-white/50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                        <div className="absolute inset-0 rounded-[1.2rem] bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <prop.icon
                           className="relative z-10 h-7 w-7 text-foreground transition-colors duration-500 group-hover:text-accent"
                           strokeWidth={1.5}
                        />
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <h4 className="text-base font-bold text-foreground">
                           {prop.title}
                        </h4>
                        <p className="text-sm font-medium text-muted-foreground text-balance">
                           {prop.description}
                        </p>
                     </div>
                  </motion.div>
               ))}
            </motion.div>
         </div>
      </section>
   );
}
