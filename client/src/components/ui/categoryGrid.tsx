import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
   href: string;
   title: string;
   imageSrc: string;
   className?: string;
}

const CategoryCard = ({
   href,
   title,
   imageSrc,
   className = '',
}: CategoryCardProps) => (
   <Link
      href={href}
      className={`group relative overflow-hidden rounded-4xl border border-border/50 bg-surface shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${className}`}
   >
      <Image
         src={imageSrc}
         alt={title}
         fill
         className="object-cover transition-transform duration-700 ease-(--ease-spring) group-hover:scale-105"
         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-background/90 via-background/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 z-10 flex w-full flex-col justify-end p-6 sm:p-8 lg:p-10">
         <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
         </h3>

         <div className="mt-5 flex w-fit items-center gap-2 rounded-full border-2 border-foreground bg-transparent px-6 py-2.5 text-sm font-bold text-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:shadow-lg">
            Shop now
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
         </div>
      </div>
   </Link>
);

export default function CategoryGrid() {
   return (
      <section className="w-full bg-background py-16 sm:py-24">
         <div className="container-px mx-auto max-w-7xl">
            <div className="grid h-auto grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:h-[600px] lg:grid-cols-4 lg:grid-rows-2">
               <CategoryCard
                  href="/smartphones"
                  title="Smartphones"
                  imageSrc="/cat_smartphone.jpg"
                  className="col-span-1 h-[400px] md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-2 lg:h-full"
               />

               <CategoryCard
                  href="/audio"
                  title="Audio"
                  imageSrc="/cat_audio.jpg"
                  className="col-span-1 h-[250px] md:col-span-1 md:row-span-2 md:h-full lg:col-span-2 lg:row-span-1 lg:h-full"
               />

               <CategoryCard
                  href="/cases"
                  title="Cases"
                  imageSrc="/cat_case.jpg"
                  className="col-span-1 h-[250px] md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 lg:h-full"
               />

               <CategoryCard
                  href="/chargers"
                  title="Chargers"
                  imageSrc="/cat_charger.jpg"
                  className="col-span-1 h-[250px] md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 lg:h-full"
               />
            </div>
         </div>
      </section>
   );
}
