import ProductCard from './card';

const trendingProducts = [
   {
      id: 'iphone-17-pro',
      name: 'iPhone 17 Pro',
      price: '$1,099',
      category: 'Smartphones',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
      isNew: true,
   },
   {
      id: 'airpods-max',
      name: 'AirPods Max 2',
      price: '$549',
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=800&auto=format&fit=crop',
      isNew: true,
   },
   {
      id: 'watch-ultra',
      name: 'Watch Ultra 3',
      price: '$799',
      category: 'Wearables',
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
      isNew: false,
   },
   {
      id: 'macbook-pro',
      name: 'MacBook Pro M4',
      price: '$1,999',
      category: 'Computing',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
      isNew: true,
   },
   {
      id: 'ipad-pro',
      name: 'iPad Pro Nano',
      price: '$999',
      category: 'Tablets',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
      isNew: false,
   },
   {
      id: 'homepod',
      name: 'HomePod 3',
      price: '$299',
      category: 'Smart Home',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
      isNew: false,
   },
];

export default function Trending() {
   return (
      <section className="w-full bg-background pt-28 pb-12 lg:pt-26 lg:pb-16">
         <div className="container-px mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
               <div className="space-y-2">
                  <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                     Trending Now
                  </h2>
                  <p className="text-base font-medium text-muted-foreground">
                     The latest and greatest in high-performance technology.
                  </p>
               </div>
               <div className="flex items-center gap-4">
                  <button className="rounded-full bg-surface px-6 py-2.5 text-sm font-bold text-foreground border border-border/40 transition-colors hover:bg-muted">
                     View All
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8">
               {trendingProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
               ))}
            </div>
         </div>
      </section>
   );
}
