'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../ui/card';
import { motion, Variants } from 'framer-motion';
import { productsApi } from '@/lib/api-client';
import type { Product } from '@/types';
import { Loader2 } from 'lucide-react';
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

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const data = await productsApi.getAll({ limit: 8 });
            setProducts(data.products);
         } catch (error) {
            console.error('Error fetching new arrivals:', error);
         } finally {
            setLoading(false);
         }
      };

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
                     The absolute latest in precision technology and high-performance gear.
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
               <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-accent" />
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
