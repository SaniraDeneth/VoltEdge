'use client';

import { useState, useEffect, use, useRef } from 'react';
import { productApi, categoryApi, brandApi } from '@/lib/api-client';
import type { Product, Category, Brand } from '@/types';
import ProductCard from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Search,
   SlidersHorizontal,
   X,
   ChevronDown,
   Loader2,
   ShoppingBag,
   ChevronLeft,
   ChevronRight,
   Check,
   Tag,
   Clock,
   Filter,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/ui/CustomSelect';

const SORT_OPTIONS = [
   { label: 'Newest First', value: '-createdAt' },
   { label: 'Oldest First', value: 'createdAt' },
   { label: 'Price: Low to High', value: 'price' },
   { label: 'Price: High to Low', value: '-price' },
   { label: 'Name: A to Z', value: 'name' },
];

const SPEC_FILTERS = [
   { label: 'RAM', options: ['8GB', '16GB', '32GB', '64GB'] },
   {
      label: 'CPU',
      options: [
         'M3',
         'M3 Pro',
         'M3 Max',
         'Intel Core i7',
         'Intel Core i9',
         'Ryzen 7',
         'Ryzen 9',
      ],
   },
   { label: 'Color', options: ['Space Gray', 'Silver', 'Black', 'Blue'] },
];

export default function ProductsPage({
   searchParams,
}: {
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
   const router = useRouter();
   const resolvedSearchParams = use(searchParams);

   const currentCategory = resolvedSearchParams.category as string;
   const currentBrand = resolvedSearchParams.brand as string;
   const currentSearch = resolvedSearchParams.search as string;
   const currentSort = (resolvedSearchParams.sort as string) || '-createdAt';
   const currentMinPrice = resolvedSearchParams.minPrice as string;
   const currentMaxPrice = resolvedSearchParams.maxPrice as string;
   const currentPage = parseInt(resolvedSearchParams.page as string) || 1;
   const currentAvailability = resolvedSearchParams.availability as string;
   const currentStatus = resolvedSearchParams.status as string;
   const currentNewArrivals = resolvedSearchParams.newArrivals === 'true';
   const currentSpecs = (resolvedSearchParams.specs as string) || '';

   const [products, setProducts] = useState<Product[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
   const [brands, setBrands] = useState<Brand[]>([]);
   const [pagination, setPagination] = useState({
      totalPages: 1,
      totalProducts: 0,
   });
   const [loading, setLoading] = useState(true);
   const [showMobileFilters, setShowMobileFilters] = useState(false);
   const [isSortOpen, setIsSortOpen] = useState(false);
   const sortRef = useRef<HTMLDivElement>(null);

   // Accordion States - Category is open if pre-selected, others closed by default
   const [openSections, setOpenSections] = useState<Record<string, boolean>>({
      category: !!currentCategory,
      brand: !!currentBrand,
      price: !!(currentMinPrice || currentMaxPrice),
      specs: !!currentSpecs,
      availability: !!currentAvailability,
   });

   const toggleSection = (section: string) => {
      setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
   };

   const [minPriceInput, setMinPriceInput] = useState(currentMinPrice || '');
   const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice || '');

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            sortRef.current &&
            !sortRef.current.contains(event.target as Node)
         ) {
            setIsSortOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [cats, brs] = await Promise.all([
               categoryApi.getAll(),
               brandApi.getAll(),
            ]);
            setCategories(cats);
            setBrands(brs);
         } catch (error) {
            console.error('Error fetching filters:', error);
         }
      };
      fetchData();
   }, []);

   useEffect(() => {
      const fetchProducts = async () => {
         setLoading(true);
         try {
            const params: Record<string, string | number | boolean> = {
               sort: currentSort,
               page: currentPage,
               limit: 12,
            };
            if (currentCategory) params.category = currentCategory;
            if (currentBrand) params.brand = currentBrand;
            if (currentSearch) params.search = currentSearch;
            if (currentMinPrice) params.minPrice = currentMinPrice;
            if (currentMaxPrice) params.maxPrice = currentMaxPrice;
            if (currentAvailability) params.availability = currentAvailability;
            if (currentStatus) params.status = currentStatus;
            if (currentNewArrivals) params.newArrivals = 'true';
            if (currentSpecs) params.specs = currentSpecs;

            const data = await productApi.getAll(params);
            setProducts(data.products);
            setPagination(data.pagination);
         } catch (error) {
            console.error('Error fetching products:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchProducts();
   }, [
      currentCategory,
      currentBrand,
      currentSearch,
      currentSort,
      currentMinPrice,
      currentMaxPrice,
      currentPage,
      currentAvailability,
      currentStatus,
      currentNewArrivals,
      currentSpecs,
   ]);

   const updateFilter = (
      key: string,
      value: string | number | boolean | null
   ) => {
      const params = new URLSearchParams(window.location.search);
      if (value !== null && value !== '' && value !== false) {
         params.set(key, String(value));
      } else {
         params.delete(key);
      }
      if (key !== 'page') params.set('page', '1');

      router.push(`/products?${params.toString()}`, { scroll: false });
   };

   const toggleSpecFilter = (label: string, value: string) => {
      const params = new URLSearchParams(window.location.search);
      const currentSpecsList = currentSpecs ? currentSpecs.split(',') : [];
      const specString = `${label}:${value}`;

      let newSpecs;
      if (currentSpecsList.includes(specString)) {
         newSpecs = currentSpecsList.filter((s) => s !== specString);
      } else {
         newSpecs = [...currentSpecsList, specString];
      }

      if (newSpecs.length > 0) {
         params.set('specs', newSpecs.join(','));
      } else {
         params.delete('specs');
      }
      params.set('page', '1');
      router.push(`/products?${params.toString()}`, { scroll: false });
   };

   const applyPriceRange = () => {
      const params = new URLSearchParams(window.location.search);
      if (minPriceInput) params.set('minPrice', minPriceInput);
      else params.delete('minPrice');
      if (maxPriceInput) params.set('maxPrice', maxPriceInput);
      else params.delete('maxPrice');
      params.set('page', '1');
      router.push(`/products?${params.toString()}`, { scroll: false });
   };

   const clearFilters = () => {
      setMinPriceInput('');
      setMaxPriceInput('');
      router.push('/products');
   };

   const SidebarSection = ({
      title,
      id,
      children,
   }: {
      title: string;
      id: string;
      children: React.ReactNode;
   }) => (
      <div className="border-b border-border/30 pb-6 mb-6 last:border-0">
         <button
            onClick={() => toggleSection(id)}
            className="flex w-full items-center justify-between py-2 text-left group"
         >
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
               {title}
            </h3>
            <motion.div
               animate={{ rotate: openSections[id] ? 180 : 0 }}
               transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
               <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
         </button>
         <AnimatePresence initial={false}>
            {openSections[id] && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
               >
                  <div className="pt-4 space-y-1.5">{children}</div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );

   return (
      <div className="min-h-screen bg-background pt-24 pb-20">
         <div className="container-px mx-auto max-w-7xl">
            {/* Header & Search */}
            <div className="mb-8 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
               <div className="space-y-2">
                  <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                     Explore Products
                  </h1>
                  <div className="flex items-center gap-3">
                     <p className="text-base font-medium text-muted-foreground">
                        {pagination.totalProducts} precision instruments found
                     </p>
                     <div className="hidden sm:flex items-center gap-2 ml-4">
                        <button
                           onClick={() =>
                              updateFilter('newArrivals', !currentNewArrivals)
                           }
                           className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                              currentNewArrivals
                                 ? 'border-accent bg-accent text-accent-foreground shadow-glow'
                                 : 'border-border/50 bg-white/60 backdrop-blur-md text-muted-foreground hover:border-foreground hover:text-foreground'
                           }`}
                        >
                           <Clock className="h-3 w-3" />
                           New Arrivals
                        </button>
                        <button
                           onClick={() =>
                              updateFilter(
                                 'status',
                                 currentStatus === 'refurbished'
                                    ? null
                                    : 'refurbished'
                              )
                           }
                           className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                              currentStatus === 'refurbished'
                                 ? 'border-accent bg-accent text-accent-foreground shadow-glow'
                                 : 'border-border/50 bg-white/60 backdrop-blur-md text-muted-foreground hover:border-foreground hover:text-foreground'
                           }`}
                        >
                           <Tag className="h-3 w-3" />
                           Special Offers
                        </button>
                     </div>
                  </div>
               </div>

               <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                     type="text"
                     placeholder="Search products..."
                     className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-foreground outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10 shadow-sm"
                     value={currentSearch || ''}
                     onChange={(e) => updateFilter('search', e.target.value)}
                  />
               </div>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
               {/* Desktop Sidebar Filters */}
               <aside className="hidden w-64 shrink-0 lg:block">
                  {/* Reset Filters at the top */}
                  <button
                     onClick={clearFilters}
                     className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-500 transition-all duration-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm"
                  >
                     <Filter className="h-4 w-4" />
                     Reset All Filters
                  </button>

                  <SidebarSection title="Category" id="category">
                     <button
                        onClick={() => updateFilter('category', null)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                           !currentCategory
                              ? 'bg-accent text-accent-foreground shadow-glow'
                              : 'text-foreground/70 hover:bg-surface hover:text-foreground'
                        }`}
                     >
                        All Categories
                     </button>
                     {categories.map((cat) => (
                        <button
                           key={cat.id}
                           onClick={() => updateFilter('category', cat.id)}
                           className={`flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                              currentCategory === cat.id
                                 ? 'bg-accent text-accent-foreground shadow-glow'
                                 : 'text-foreground/70 hover:bg-surface hover:text-foreground'
                           }`}
                        >
                           {cat.name}
                        </button>
                     ))}
                  </SidebarSection>

                  <SidebarSection title="Price Range" id="price">
                     <div className="flex flex-col gap-4 px-2">
                        <div className="flex items-center gap-2">
                           <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                                 $
                              </span>
                              <input
                                 type="number"
                                 placeholder="Min"
                                 className="w-full rounded-xl border border-border/50 bg-surface py-2 pl-7 pr-2 text-xs text-foreground outline-none focus:border-accent"
                                 value={minPriceInput}
                                 onChange={(e) =>
                                    setMinPriceInput(e.target.value)
                                 }
                              />
                           </div>
                           <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                                 $
                              </span>
                              <input
                                 type="number"
                                 placeholder="Max"
                                 className="w-full rounded-xl border border-border/50 bg-surface py-2 pl-7 pr-2 text-xs text-foreground outline-none focus:border-accent"
                                 value={maxPriceInput}
                                 onChange={(e) =>
                                    setMaxPriceInput(e.target.value)
                                 }
                              />
                           </div>
                        </div>
                        <button
                           onClick={applyPriceRange}
                           className="w-full rounded-xl bg-foreground py-2 text-xs font-bold text-background transition-all hover:opacity-90"
                        >
                           Apply
                        </button>
                     </div>
                  </SidebarSection>

                  <SidebarSection title="Availability" id="availability">
                     <div className="flex flex-wrap gap-1.5 px-2">
                        {[
                           { label: 'In Stock', value: 'in-stock' },
                           { label: 'Out of Stock', value: 'out-of-stock' },
                        ].map((opt) => (
                           <button
                              key={opt.value}
                              onClick={() =>
                                 updateFilter(
                                    'availability',
                                    currentAvailability === opt.value
                                       ? null
                                       : opt.value
                                 )
                              }
                              className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-all ${
                                 currentAvailability === opt.value
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-border/40 text-muted-foreground hover:border-foreground hover:text-foreground'
                              }`}
                           >
                              {opt.label}
                           </button>
                        ))}
                     </div>
                  </SidebarSection>

                  <SidebarSection title="Tech Specs" id="specs">
                     <div className="space-y-6 px-2">
                        {SPEC_FILTERS.map((spec) => (
                           <div key={spec.label}>
                              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                 {spec.label}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                 {spec.options.map((opt) => {
                                    const isActive = currentSpecs.includes(
                                       `${spec.label}:${opt}`
                                    );
                                    return (
                                       <button
                                          key={opt}
                                          onClick={() =>
                                             toggleSpecFilter(spec.label, opt)
                                          }
                                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all ${
                                             isActive
                                                ? 'border-accent bg-accent/10 text-accent'
                                                : 'border-border/40 text-muted-foreground hover:border-foreground hover:text-foreground'
                                          }`}
                                       >
                                          {opt}
                                       </button>
                                    );
                                 })}
                              </div>
                           </div>
                        ))}
                     </div>
                  </SidebarSection>

                  <SidebarSection title="Brand" id="brand">
                     <div className="flex flex-col gap-1.5">
                        {brands.map((brand) => (
                           <button
                              key={brand.id}
                              onClick={() => updateFilter('brand', brand.id)}
                              className={`flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                                 currentBrand === brand.id
                                    ? 'bg-accent text-accent-foreground shadow-glow'
                                    : 'text-foreground/70 hover:bg-surface hover:text-foreground'
                              }`}
                           >
                              {brand.name}
                           </button>
                        ))}
                     </div>
                  </SidebarSection>
               </aside>

               {/* Main Content */}
               <main className="flex-1">
                  <div className="mb-8 flex items-center justify-between lg:justify-end">
                     <button
                        onClick={() => setShowMobileFilters(true)}
                        className="flex items-center gap-2 rounded-xl border border-border/50 bg-white/60 backdrop-blur-md px-4 py-2.5 text-sm font-bold text-foreground transition-all duration-300 hover:bg-white/80 lg:hidden"
                     >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                     </button>

                     <div className="w-52">
                        <CustomSelect
                           label=""
                           options={SORT_OPTIONS.map(opt => ({ id: opt.value, name: opt.label }))}
                           value={currentSort}
                           onChange={(val) => updateFilter('sort', val)}
                           placeholder="Sort By"
                        />
                     </div>
                  </div>

                  {loading ? (
                     <div className="flex h-96 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                     </div>
                  ) : products.length > 0 ? (
                     <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                           {products.map((product) => (
                              <ProductCard
                                 key={product.id}
                                 id={product.id}
                                 name={product.name}
                                 price={`$${product.price}`}
                                 category={
                                    product.category?.name || 'Uncategorized'
                                 }
                                 image={product.images?.[0] || ''}
                                 isNew={product.status === 'brandnew'}
                                 countInStock={product.countInStock}
                              />
                           ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                           <div className="mt-16 flex items-center justify-center gap-2">
                              <button
                                 onClick={() =>
                                    updateFilter('page', currentPage - 1)
                                 }
                                 disabled={currentPage === 1}
                                 className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface text-foreground transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:hover:bg-surface disabled:hover:text-foreground"
                              >
                                 <ChevronLeft className="h-5 w-5" />
                              </button>

                              {[...Array(pagination.totalPages)].map((_, i) => (
                                 <button
                                    key={i}
                                    onClick={() => updateFilter('page', i + 1)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                                       currentPage === i + 1
                                          ? 'bg-accent text-accent-foreground shadow-glow'
                                          : 'border border-border/50 bg-surface text-foreground hover:border-accent'
                                    }`}
                                 >
                                    {i + 1}
                                 </button>
                              ))}

                              <button
                                 onClick={() =>
                                    updateFilter('page', currentPage + 1)
                                 }
                                 disabled={
                                    currentPage === pagination.totalPages
                                 }
                                 className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-surface text-foreground transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:hover:bg-surface disabled:hover:text-foreground"
                              >
                                 <ChevronRight className="h-5 w-5" />
                              </button>
                           </div>
                        )}
                     </>
                  ) : (
                     <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                        <div className="rounded-full bg-surface p-6">
                           <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-xl font-bold text-foreground">
                              No products found
                           </h3>
                           <p className="text-muted-foreground">
                              Try adjusting your filters or search terms.
                           </p>
                        </div>
                        <button
                           onClick={clearFilters}
                           className="mt-4 rounded-full bg-accent px-8 py-3 font-bold text-accent-foreground shadow-glow"
                        >
                           Clear All Filters
                        </button>
                     </div>
                  )}
               </main>
            </div>
         </div>

         {/* Mobile Filters Modal */}
         <AnimatePresence>
            {showMobileFilters && (
               <>
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setShowMobileFilters(false)}
                     className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                  />
                  <motion.div
                     initial={{ x: '100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '100%' }}
                     transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 200,
                     }}
                     className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white/90 p-8 shadow-2xl overflow-y-auto backdrop-blur-2xl"
                  >
                     <div className="mb-10 flex items-center justify-between">
                        <h2 className="font-display text-3xl font-bold">
                           Filters
                        </h2>
                        <button
                           onClick={() => setShowMobileFilters(false)}
                           className="rounded-full bg-surface p-2 text-foreground"
                        >
                           <X className="h-6 w-6" />
                        </button>
                     </div>

                     <div className="space-y-10">
                        {/* Mobile Category */}
                        <div>
                           <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                              Category
                           </h3>
                           <div className="flex flex-wrap gap-2">
                              {categories.map((cat) => (
                                 <button
                                    key={cat.id}
                                    onClick={() =>
                                       updateFilter('category', cat.id)
                                    }
                                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                                       currentCategory === cat.id
                                          ? 'bg-accent text-accent-foreground shadow-glow'
                                          : 'bg-surface text-foreground'
                                    }`}
                                 >
                                    {cat.name}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Mobile Price */}
                        <div>
                           <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                              Price Range
                           </h3>
                           <div className="flex items-center gap-3">
                              <input
                                 type="number"
                                 placeholder="Min"
                                 className="w-full rounded-xl border border-border/50 bg-surface py-3 px-4 text-sm text-foreground outline-none"
                                 value={minPriceInput}
                                 onChange={(e) =>
                                    setMinPriceInput(e.target.value)
                                 }
                              />
                              <input
                                 type="number"
                                 placeholder="Max"
                                 className="w-full rounded-xl border border-border/50 bg-surface py-3 px-4 text-sm text-foreground outline-none"
                                 value={maxPriceInput}
                                 onChange={(e) =>
                                    setMaxPriceInput(e.target.value)
                                 }
                              />
                           </div>
                           <button
                              onClick={applyPriceRange}
                              className="mt-4 w-full rounded-xl bg-foreground py-3 font-bold text-background"
                           >
                              Apply Price Range
                           </button>
                        </div>

                        {/* Mobile Tech Specs */}
                        <div>
                           <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                              Tech Specs
                           </h3>
                           <div className="space-y-6">
                              {SPEC_FILTERS.map((spec) => (
                                 <div key={spec.label}>
                                    <p className="mb-2 text-[10px] font-black uppercase text-muted-foreground">
                                       {spec.label}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                       {spec.options.map((opt) => {
                                          const isActive =
                                             currentSpecs.includes(
                                                `${spec.label}:${opt}`
                                             );
                                          return (
                                             <button
                                                key={opt}
                                                onClick={() =>
                                                   toggleSpecFilter(
                                                      spec.label,
                                                      opt
                                                   )
                                                }
                                                className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                                                   isActive
                                                      ? 'border-accent bg-accent text-accent-foreground'
                                                      : 'border-border/50 text-foreground'
                                                }`}
                                             >
                                                {opt}
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Mobile Brand */}
                        <div>
                           <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                              Brand
                           </h3>
                           <div className="flex flex-wrap gap-2">
                              {brands.map((brand) => (
                                 <button
                                    key={brand.id}
                                    onClick={() =>
                                       updateFilter('brand', brand.id)
                                    }
                                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                                       currentBrand === brand.id
                                          ? 'bg-accent text-accent-foreground shadow-glow'
                                          : 'bg-surface text-foreground'
                                    }`}
                                 >
                                    {brand.name}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <button
                           onClick={() => {
                              clearFilters();
                              setShowMobileFilters(false);
                           }}
                           className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 py-4 font-bold text-foreground/50 transition-all hover:text-foreground"
                        >
                           Reset All Filters
                        </button>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </div>
   );
}
