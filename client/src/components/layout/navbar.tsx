'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
   Search,
   Menu,
   X,
   Zap,
   ShoppingBag,
   ArrowRight,
   Loader2,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { productApi } from '@/lib/api-client';
import type { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '../ui/ConfirmDialog';

export default function Navbar() {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
   const { user, isAuthenticated, logout } = useAuth();
   const [searchQuery, setSearchQuery] = useState('');
   const [recommendations, setRecommendations] = useState<Product[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const searchRef = useRef<HTMLDivElement>(null);
   const router = useRouter();
   const pathname = usePathname();
   const { cartCount } = useCart();

   const navLinks = [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      {
         name: 'Smartphones',
         href: '/products?category=69fcc56bd2effd25a1411d4e',
      },
      {
         name: 'Accessories',
         href: '/products?category=69fcc56bd2effd25a1411d4f',
      },
   ];

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };

      setIsMobileMenuOpen(false);
      handleScroll();

      const scrollCheckInterval = setInterval(handleScroll, 50);
      const stopIntervalTimeout = setTimeout(() => {
         clearInterval(scrollCheckInterval);
      }, 200);

      window.addEventListener('scroll', handleScroll, { passive: true });

      const handleClickOutside = (event: MouseEvent) => {
         if (
            searchRef.current &&
            !searchRef.current.contains(event.target as Node)
         ) {
            setShowSuggestions(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         window.removeEventListener('scroll', handleScroll);
         document.removeEventListener('mousedown', handleClickOutside);
         clearInterval(scrollCheckInterval);
         clearTimeout(stopIntervalTimeout);
      };
   }, [pathname]);

   useEffect(() => {
      const fetchRecommendations = async () => {
         if (searchQuery.length < 2) {
            setRecommendations([]);
            return;
         }

         setIsSearching(true);
         try {
            const data = await productApi.getAll({
               search: searchQuery,
               limit: 5,
            });
            setRecommendations(data.products);
         } catch (error) {
            console.error('Error fetching recommendations:', error);
         } finally {
            setIsSearching(false);
         }
      };

      const timeoutId = setTimeout(fetchRecommendations, 300);
      return () => clearTimeout(timeoutId);
   }, [searchQuery]);

   const handleSearchSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (searchQuery.trim()) {
         router.push(
            `/products?search=${encodeURIComponent(searchQuery.trim())}`
         );
         setShowSuggestions(false);
         setIsMobileMenuOpen(false);
      } else {
         toast.error('Please enter a search term');
      }
   };

   return (
      <div className="fixed top-0 z-50 flex w-full justify-center px-4 pt-4 transition-all duration-500 pointer-events-none">
         <header
            className={`pointer-events-auto relative w-full transition-[max-width,border-radius,background,padding,box-shadow] duration-500 ease-(--ease-spring) ${
               isScrolled
                  ? `glass max-w-7xl py-1 shadow-lg ${isMobileMenuOpen ? 'rounded-[24px]' : 'rounded-[32px]'}`
                  : `max-w-7xl border border-border/40 py-3 backdrop-blur-xl ${isMobileMenuOpen ? 'rounded-[24px]' : 'rounded-[24px]'}`
            }`}
         >
            <div className="flex h-14 items-center justify-between px-6 lg:px-8">
               <Link
                  href="/"
                  className="group relative z-10 flex items-center gap-2"
               >
                  <div
                     className={`flex items-center justify-center rounded-xl bg-(image:--gradient-accent) shadow-glow transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 ${
                        isScrolled ? 'h-8 w-8' : 'h-10 w-10'
                     }`}
                  >
                     <Zap className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <span
                     className={`font-display font-bold tracking-tight text-foreground transition-all duration-500 ${
                        isScrolled ? 'text-xl' : 'text-2xl'
                     }`}
                  >
                     Volt
                     <span className="bg-(image:--gradient-accent) bg-clip-text text-transparent">
                        Edge
                     </span>
                  </span>
               </Link>

               <nav className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-center lg:gap-8">
                  {navLinks.map((link) => (
                     <Link
                        key={link.name}
                        href={link.href}
                        className="group relative py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                     >
                        {link.name}
                        <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-accent shadow-glow transition-all duration-300 ease-(--ease-apple) group-hover:w-full"></span>
                     </Link>
                  ))}
               </nav>

               <div className="relative z-10 flex items-center gap-4">
                  <div
                     className="group relative hidden lg:block"
                     ref={searchRef}
                  >
                     <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex items-center"
                     >
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
                        <input
                           type="text"
                           placeholder="Search..."
                           value={searchQuery}
                           onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setShowSuggestions(true);
                           }}
                           onFocus={() => setShowSuggestions(true)}
                           className={`rounded-full border border-input bg-background/50 pl-10 pr-4 text-sm backdrop-blur-sm outline-none transition-all duration-500 ease-(--ease-apple) focus:border-accent focus:ring-4 focus:ring-accent/10 focus:bg-background ${
                              isScrolled
                                 ? 'h-9 w-32 focus:w-48'
                                 : 'h-10 w-40 focus:w-64'
                           }`}
                        />
                     </form>

                     <AnimatePresence>
                        {showSuggestions && searchQuery.length >= 2 && (
                           <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute left-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl"
                           >
                              {isSearching ? (
                                 <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                                 </div>
                              ) : recommendations.length > 0 ? (
                                 <div className="space-y-1">
                                    <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                       Suggested Products
                                    </p>
                                    {recommendations.map((product) => (
                                       <button
                                          key={product.id}
                                          onClick={() => {
                                             router.push(
                                                `/products/${product.id}`
                                             );
                                             setShowSuggestions(false);
                                             setSearchQuery('');
                                          }}
                                          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-accent/5 group/item"
                                       >
                                          <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border/50 bg-white">
                                             <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform group-hover/item:scale-110"
                                                sizes="40px"
                                             />
                                          </div>
                                          <div className="flex-1 overflow-hidden">
                                             <p className="truncate text-xs font-bold text-foreground">
                                                {product.name}
                                             </p>
                                             <p className="text-[10px] font-medium text-muted-foreground">
                                                ${product.price}
                                             </p>
                                          </div>
                                          <ArrowRight className="h-3 w-3 translate-x-[-10px] opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100 text-accent" />
                                       </button>
                                    ))}
                                 </div>
                              ) : (
                                 <div className="py-8 text-center">
                                    <p className="text-xs font-medium text-muted-foreground">
                                       No products found
                                    </p>
                                 </div>
                              )}
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  <Link
                     href="/cart"
                     className="relative p-2 text-muted-foreground transition-transform hover:scale-110 hover:text-foreground"
                  >
                     <ShoppingBag className="h-5 w-5" />
                     {cartCount > 0 && (
                        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
                           {cartCount}
                        </span>
                     )}
                  </Link>

                  <div className="hidden sm:block">
                     <div className="hidden sm:flex items-center gap-4">
                        {isAuthenticated ? (
                           <div className="relative group">
                              <button
                                 className={`relative overflow-hidden rounded-full border-2 border-transparent transition-all duration-500 hover:border-accent hover:shadow-glow ${
                                    isScrolled ? 'h-8 w-8' : 'h-10 w-10'
                                 }`}
                              >
                                 <Image
                                    src={
                                       user?.avatar ||
                                       `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=220%2014%25%208%25&color=fff`
                                    }
                                    alt="Profile"
                                    fill
                                    unoptimized
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 768px) 32px, 40px"
                                 />
                              </button>

                              {/* Profile Dropdown */}
                              <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                                 <div className="w-48 overflow-hidden rounded-2xl border border-white/10 bg-noir/90 backdrop-blur-xl p-2 shadow-2xl">
                                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                                       <p className="text-xs font-bold text-white truncate">
                                          {user?.name}
                                       </p>
                                       <p className="text-[10px] text-white/40 truncate">
                                          {user?.email}
                                       </p>
                                    </div>
                                    <Link
                                       href="/profile"
                                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                                    >
                                       My Profile
                                    </Link>
                                    <button
                                       onClick={() =>
                                          setIsLogoutConfirmOpen(true)
                                       }
                                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-white/60 transition-colors hover:bg-accent/10 hover:text-accent"
                                    >
                                       Logout
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <Link
                              href="/login"
                              className="hover-lift rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background shadow-sm transition-all hover:bg-noir"
                           >
                              Sign In
                           </Link>
                        )}
                     </div>
                  </div>

                  <button
                     className="ml-1 p-1 text-foreground transition-transform active:scale-95 lg:hidden"
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                     {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                     ) : (
                        <Menu className="h-6 w-6" />
                     )}
                  </button>
               </div>
            </div>

            <div
               className={`grid transition-all duration-500 ease-(--ease-spring) lg:hidden ${
                  isMobileMenuOpen
                     ? 'grid-rows-[1fr] border-t border-border/50 opacity-100'
                     : 'grid-rows-[0fr] opacity-0 border-transparent'
               }`}
            >
               <div className="overflow-hidden">
                  <div className="flex flex-col space-y-4 p-6">
                     <form
                        onSubmit={handleSearchSubmit}
                        className="relative mb-2"
                     >
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <input
                           type="text"
                           placeholder="Search products..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full rounded-2xl border border-border/50 bg-surface py-3.5 pl-12 pr-14 text-sm outline-none focus:border-accent"
                        />
                        <button
                           type="submit"
                           className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md transition-transform active:scale-90"
                        >
                           <Search className="h-4 w-4" />
                        </button>
                     </form>

                     <AnimatePresence>
                        {searchQuery.length >= 2 && (
                           <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-4 overflow-hidden rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm"
                           >
                              {isSearching ? (
                                 <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                                 </div>
                              ) : recommendations.length > 0 ? (
                                 <div className="p-2 space-y-1">
                                    {recommendations.map((product) => (
                                       <button
                                          key={product.id}
                                          onClick={() => {
                                             router.push(
                                                `/products/${product.id}`
                                             );
                                             setIsMobileMenuOpen(false);
                                             setSearchQuery('');
                                          }}
                                          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-white/50"
                                       >
                                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border/30 bg-white">
                                             <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                             />
                                          </div>
                                          <div className="flex-1 overflow-hidden">
                                             <p className="truncate text-sm font-bold text-foreground">
                                                {product.name}
                                             </p>
                                             <p className="text-xs font-medium text-muted-foreground">
                                                ${product.price}
                                             </p>
                                          </div>
                                          <ArrowRight className="h-4 w-4 text-accent" />
                                       </button>
                                    ))}
                                 </div>
                              ) : (
                                 <div className="py-6 text-center">
                                    <p className="text-xs font-medium text-muted-foreground">
                                       No products found
                                    </p>
                                 </div>
                              )}
                           </motion.div>
                        )}
                     </AnimatePresence>

                     <div className="space-y-1">
                        {navLinks.map((link) => (
                           <Link
                              key={link.name}
                              href={link.href}
                              className={`flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-lg font-bold transition-all ${
                                 pathname === link.href
                                    ? 'bg-accent/10 text-accent'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                           >
                              {link.name}
                              <ArrowRight
                                 className={`h-4 w-4 transition-opacity ${pathname === link.href ? 'opacity-100' : 'opacity-0'}`}
                              />
                           </Link>
                        ))}
                     </div>

                     <div className="pt-4 mt-4 border-t border-border/50">
                        {isAuthenticated ? (
                           <div className="space-y-3">
                              <div className="flex items-center gap-4 px-5 py-2">
                                 <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-accent/20">
                                    <Image
                                       src={
                                          user?.avatar ||
                                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=220%2014%25%208%25&color=fff`
                                       }
                                       alt="Profile"
                                       fill
                                       unoptimized
                                       className="object-cover"
                                    />
                                 </div>
                                 <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-base font-bold text-foreground">
                                       {user?.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                       {user?.email}
                                    </p>
                                 </div>
                              </div>
                              <Link
                                 href="/profile"
                                 onClick={() => setIsMobileMenuOpen(false)}
                                 className="flex w-full items-center justify-between rounded-xl bg-secondary px-5 py-3.5 text-lg font-bold text-foreground transition-all active:scale-95"
                              >
                                 My Profile
                                 <ArrowRight className="h-4 w-4" />
                              </Link>
                              <button
                                 onClick={() => {
                                    setIsLogoutConfirmOpen(true);
                                    setIsMobileMenuOpen(false);
                                 }}
                                 className="flex w-full items-center justify-between rounded-xl bg-accent/5 px-5 py-3.5 text-lg font-bold text-accent transition-all active:scale-95"
                              >
                                 Logout
                                 <ArrowRight className="h-4 w-4" />
                              </button>
                           </div>
                        ) : (
                           <Link
                              href="/login"
                              className="flex w-full items-center justify-between rounded-xl bg-foreground px-5 py-3.5 text-lg font-bold text-background transition-all active:scale-95"
                              onClick={() => setIsMobileMenuOpen(false)}
                           >
                              Sign In
                              <ArrowRight className="h-4 w-4" />
                           </Link>
                        )}
                     </div>
                  </div>
               </div>
            </div>
            <ConfirmDialog
               isOpen={isLogoutConfirmOpen}
               onClose={() => setIsLogoutConfirmOpen(false)}
               onConfirm={() => {
                  logout();
                  setIsLogoutConfirmOpen(false);
               }}
               title="Logout"
               message="Are you sure you want to log out of your account?"
               confirmText="Yes, Logout"
               type="danger"
            />
         </header>
      </div>
   );
}
