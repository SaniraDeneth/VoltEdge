'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../ui/card';
import ProductCardSkeleton from '../ui/ProductCardSkeleton';
import { motion, Variants } from 'framer-motion';
import { productApi } from '@/lib/api-client';
import type { Product } from '@/types';
import Link from 'next/link';

const containerVariants: Variants = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1,
         delayChildren: 0.2,
      },
   },
};

const itemVariants: Variants = {
   hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
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

export default function NewArrivals() {
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
         const data = await productApi.getAll({ limit: 8 });
         setProducts(data.products);
      } catch (err: unknown) {
         console.error('Error fetching new arrivals:', err);
         const errorMessage =
            err instanceof Error ? err.message : 'Failed to load products.';
         setError(errorMessage);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchProducts();
   }, []);

   return (
      <section className="w-full bg-background pt-28 pb-10 lg:pt-26 lg:pb-12 overflow-hidden">
         <div className="container-px mx-auto max-w-7xl">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: '-100px' }}
               transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
               className="mb-12 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
            >
               <div className="space-y-2">
                  <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                     New Arrivals
                  </h2>
                  <p className="text-base font-medium text-muted-foreground">
                     The absolute latest in precision technology and
                     high-performance gear.
                  </p>
               </div>
               <div className="flex items-center gap-4">
                  <Link
                     href="/products"
                     className="rounded-full bg-surface px-6 py-2.5 text-sm font-bold text-foreground border border-border/40 transition-colors hover:bg-muted hover:shadow-sm hover-lift"
                  >
                     Explore All
                  </Link>
               </div>
            </motion.div>

            {loading ? (
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                     <ProductCardSkeleton key={i} />
                  ))}
               </div>
            ) : error ? (
               <div className="flex flex-col items-center justify-center py-12 px-6 rounded-4xl bg-surface border border-border/40 text-center shadow-sm max-w-xl mx-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                     <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                     </svg>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">
                     Unable to load new arrivals
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                     {error}
                  </p>
                  <button
                     onClick={fetchProducts}
                     className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-accent-glow hover:shadow-[0_0_20px_hsl(var(--accent)/0.3)] hover-lift cursor-pointer"
                  >
                     Reload Products
                  </button>
               </div>
            ) : (
               <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8"
               >
                  {products.map((product) => (
                     <motion.div key={product.id} variants={itemVariants}>
                        <ProductCard
                           id={product.id}
                           name={product.name}
                           price={`$${product.price}`}
                           category={product.category?.name || 'Uncategorized'}
                           image={product.images?.[0] || ''}
                           isNew={product.status === 'brandnew'}
                           countInStock={product.countInStock}
                        />
                     </motion.div>
                  ))}
               </motion.div>
            )}
         </div>
      </section>
   );
}
