import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface ProductCardProps {
   id: string;
   name: string;
   price: string;
   category: string;
   image: string;
   isNew?: boolean;
   countInStock?: number;
}

export default function ProductCard({
   id,
   name,
   price,
   category,
   image,
   isNew,
   countInStock = 0,
}: ProductCardProps) {
   const { addToCart } = useCart();

   const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Construct a partial product object for the cart
      // We parse the price string (e.g. "$1,299") to a number
      const numericPrice = Number(price.replace(/[^0-9.-]+/g, ''));

      addToCart({
         id,
         name,
         price: numericPrice,
         images: [image],
         countInStock,
         category: { id: '', name: category }, // Dummy ID since we don't have it here
         description: '',
         specifications: [],
         status: isNew ? 'new' : '',
         warranty: { duration: '', policy: '' },
      } as Product);

      console.log('Added to cart:', name);
   };

   return (
      <Link href={`/products/${id}`} className="group block relative w-full">
         <div className="relative w-full overflow-hidden rounded-4xl bg-surface transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)]">
            {/* Image Container */}
            <div className="relative aspect-[10/13] w-full overflow-hidden rounded-4xl border border-white/5">
               <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />

               {/* Dark Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

               {/* Top Bar: Badges & Quick Add */}
               <div className="absolute inset-x-4 top-4 flex items-start justify-between z-10">
                  <div className="flex flex-col gap-1.5">
                     <div className="glass-dark w-fit rounded-full px-3 py-1 backdrop-blur-md border border-white/10">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/80">
                           {category}
                        </span>
                     </div>
                     {isNew && (
                        <div className="w-fit rounded-full bg-accent px-3 py-1 shadow-glow">
                           <span className="text-[8px] font-black uppercase tracking-widest text-accent-foreground font-bold">
                              New
                           </span>
                        </div>
                     )}
                  </div>

                  {/* Quick Add Button */}
                  {countInStock > 0 && (
                     <button
                        onClick={handleAddToCart}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-noir shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0"
                     >
                        <Plus className="h-5 w-5" strokeWidth={3} />
                     </button>
                  )}
               </div>

               {/* Availability Indicator (Floating Center or Top) */}
               <div className="absolute right-4 top-16 z-10">
                  <div
                     className={`flex items-center gap-1.5 rounded-full px-3 py-1 backdrop-blur-md border border-white/5 ${
                        countInStock > 0
                           ? 'bg-emerald-500/10 text-emerald-400'
                           : 'bg-rose-500/10 text-rose-400'
                     }`}
                  >
                     <div
                        className={`h-1.5 w-1.5 rounded-full ${
                           countInStock > 0
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-rose-400'
                        }`}
                     />
                     <span className="text-[8px] font-black uppercase tracking-widest">
                        {countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                     </span>
                  </div>
               </div>

               {/* Bottom Content Area */}
               <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 z-10">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-accent leading-tight">
                     {name}
                  </h3>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-1">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                           Starting at
                        </span>
                        <span className="font-display text-xl font-bold text-white tracking-tight">
                           {price}
                        </span>
                     </div>

                     <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-noir border border-white/10">
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Premium Outer Glow on Hover */}
         <div className="absolute -inset-2 -z-10 rounded-[2.5rem] bg-accent/20 opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100 group-hover:blur-3xl" />
      </Link>
   );
}
