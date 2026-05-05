import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
   id: string;
   name: string;
   price: string;
   category: string;
   image: string;
   isNew?: boolean;
}

export default function ProductCard({
   id,
   name,
   price,
   category,
   image,
   isNew,
}: ProductCardProps) {
   return (
      <div className="group relative w-full overflow-hidden rounded-4xl bg-noir p-1.5 transition-all duration-700 ease-(--ease-spring) hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
         <div className="relative aspect-10/12 w-full overflow-hidden rounded-[1.6rem]">
            <Image
               src={image}
               alt={name}
               fill
               className="object-cover transition-transform duration-1000 ease-(--ease-spring) group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-noir via-noir/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-x-4 top-4 flex items-start justify-between">
               <div className="flex flex-col gap-1.5">
                  <div className="glass-dark w-fit rounded-full px-2.5 py-1 backdrop-blur-md">
                     <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/70">
                        {category}
                     </span>
                  </div>
                  {isNew && (
                     <div className="w-fit rounded-full bg-accent px-2.5 py-0.5 shadow-glow">
                        <span className="text-[8px] font-black uppercase tracking-widest text-accent-foreground">
                           New
                        </span>
                     </div>
                  )}
               </div>

               {/* Quick Add Button */}
               <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-noir shadow-lg transition-all duration-500 hover:scale-110 active:scale-95 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
                  <Plus className="h-4 w-4" strokeWidth={3} />
               </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-1.5">
               <h3 className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-accent">
                  {name}
               </h3>

               <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="flex flex-col">
                     <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                        Price
                     </span>
                     <span className="font-display text-lg font-semibold text-white">
                        {price}
                     </span>
                  </div>

                  <Link
                     href={`/products/${id}`}
                     className="group/link flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-noir"
                  >
                     <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
               </div>
            </div>
         </div>

         {/* Subtle Outer Glow */}
         <div className="absolute -inset-1 -z-10 rounded-[2.1rem] bg-accent/15 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
      </div>
   );
}
