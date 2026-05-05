'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ShoppingBag, ShieldCheck, Truck, Star, Loader2 } from 'lucide-react';
import { productsApi } from '@/lib/api-client';
import type { Product } from '@/types';

export default function ProductPage() {
   const params = useParams();
   const id = params?.id as string;

   const [product, setProduct] = useState<Product | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [activeImg, setActiveImg] = useState<string>('');
   const [quantity, setQuantity] = useState(1);

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            setLoading(true);
            const data = await productsApi.getById(id);
            console.log(data);
            setProduct(data);
            if (data.images?.length > 0) {
               setActiveImg(data.images[0]);
            }
         } catch (err: unknown) {
            setError(
               err instanceof Error ? err.message : 'Failed to load product'
            );
         } finally {
            setLoading(false);
         }
      };

      if (id) fetchProduct();
   }, [id]);

   if (loading) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
         </div>
      );
   }

   if (error || !product) {
      return (
         <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <h2 className="text-2xl font-bold text-foreground">
               Product Not Found
            </h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
         </div>
      );
   }

   return (
      <main className="min-h-screen bg-background pt-24 pb-16">
         <div className="container-px mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
               {/* --- Left: Image Gallery --- */}
               <div className="flex flex-col gap-6">
                  <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-surface/30 border border-border/40">
                     <Image
                        src={activeImg}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        className="object-cover transition-all duration-700 hover:scale-105"
                        priority
                     />
                     {/* Status Badge */}
                     <div className="absolute left-6 top-6 glass-dark rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent shadow-glow">
                        {product.status}
                     </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-4">
                     {product.images.map((img, i) => (
                        <button
                           key={i}
                           onClick={() => setActiveImg(img)}
                           className={`relative h-24 w-24 overflow-hidden rounded-2xl border-2 transition-all ${
                              activeImg === img
                                 ? 'border-accent shadow-glow'
                                 : 'border-transparent opacity-60 hover:opacity-100'
                           }`}
                        >
                           <Image
                              src={img}
                              alt="thumb"
                              fill
                              sizes="100px"
                              className="object-cover"
                           />
                        </button>
                     ))}
                  </div>
               </div>

               {/* --- Right: Product Info --- */}
               <div className="flex flex-col justify-center">
                  <div className="space-y-2">
                     <div className="flex items-center gap-3">
                        {product.brand?.image && (
                           <div className="relative h-6 w-6 overflow-hidden rounded-full border border-border/40 bg-surface">
                              <Image
                                 src={product.brand.image}
                                 alt={product.brand.name}
                                 fill
                                 sizes="24px"
                                 className="object-cover"
                              />
                           </div>
                        )}
                        <span className="text-sm font-bold uppercase tracking-widest text-accent">
                           {product.brand?.name || 'VoltEdge Original'}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                           {product.category?.name}
                        </span>
                     </div>
                     <h1 className="font-display text-5xl font-black tracking-tighter text-foreground lg:text-6xl">
                        {product.name}
                     </h1>
                     <div className="flex items-center gap-4 pt-2">
                        <p className="font-display text-3xl font-medium text-foreground">
                           ${product.price}
                        </p>
                        <div className="flex items-center gap-1 text-yellow-500">
                           <Star className="h-4 w-4 fill-current" />
                           <span className="text-sm font-bold text-muted-foreground">
                              (4.9/5)
                           </span>
                        </div>
                     </div>
                  </div>

                  <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                     {product.description}
                  </p>

                  <div className="mt-10 space-y-6">
                     {/* Stock Info */}
                     <div className="flex items-center gap-3">
                        <div
                           className={`h-2.5 w-2.5 rounded-full ${product.countInStock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                        />
                        <span className="text-sm font-semibold text-foreground">
                           {product.countInStock > 0
                              ? `In Stock (${product.countInStock} units)`
                              : 'Out of Stock'}
                        </span>
                     </div>

                     {/* Action Row */}
                     <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-full border border-border/60 bg-surface px-4 py-2">
                           <button
                              onClick={() =>
                                 setQuantity(Math.max(1, quantity - 1))
                              }
                              className="px-3 py-1 font-bold"
                           >
                              -
                           </button>
                           <span className="w-8 text-center font-bold">
                              {quantity}
                           </span>
                           <button
                              onClick={() =>
                                 setQuantity(
                                    Math.min(product.countInStock, quantity + 1)
                                 )
                              }
                              className="px-3 py-1 font-bold"
                           >
                              +
                           </button>
                        </div>
                        <button className="group relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground py-4 font-bold text-background transition-all hover:bg-noir hover:shadow-xl">
                           <ShoppingBag className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                           Add to Cart
                           <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        </button>
                     </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border/20 pt-8">
                     <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-accent/10 p-2 text-accent">
                           <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">
                           {product.warranty?.duration}{' '}
                           {product.warranty?.policy}
                        </span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-accent/10 p-2 text-accent">
                           <Truck className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">
                           Express Shipping
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* --- Bottom: Specifications Section --- */}
            {product.specifications && product.specifications.length > 0 && (
               <div className="mt-24 border-t border-border/20 pt-16">
                  <div className="mb-12">
                     <h2 className="font-display text-3xl font-black tracking-tight text-foreground">
                        Technical Specifications
                     </h2>
                     <p className="mt-2 text-muted-foreground">
                        Deep dive into the power behind the {product.name}
                     </p>
                  </div>

                  <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                     {product.specifications.map((spec, i) => (
                        <div
                           key={i}
                           className="group flex flex-col gap-2 rounded-2xl border border-border/40 bg-surface/20 p-6 transition-all hover:bg-surface/40 hover:shadow-lg"
                        >
                           <span className="text-xs font-bold uppercase tracking-widest text-accent">
                              {spec.label}
                           </span>
                           <span className="text-lg font-medium text-foreground">
                              {spec.value}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </main>
   );
}
