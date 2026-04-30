'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Zap, ShoppingBag } from 'lucide-react';

export default function Navbar() {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isLoggedIn] = useState(true);

   const navLinks = [
      { name: 'Home', href: '/' },
      { name: 'Smartphones', href: '/smartphones' },
      { name: 'Accessories', href: '/accessories' },
      { name: 'Deals', href: '/deals' },
      { name: 'Support', href: '/support' },
   ];

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <div className="fixed top-0 z-50 flex w-full justify-center px-4 pt-4 transition-all duration-500 pointer-events-none">
         <header
            className={`pointer-events-auto relative w-full overflow-hidden transition-[max-width,border-radius,background,padding,box-shadow] duration-500 ease-(--ease-spring) ${
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
                  <div className="group relative hidden lg:block">
                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
                     <input
                        type="text"
                        placeholder="Search..."
                        className={`rounded-full border border-input bg-background/50 pl-9 pr-4 text-sm backdrop-blur-sm outline-none transition-all duration-500 ease-(--ease-apple) focus:border-ring focus:ring-1 focus:ring-ring focus:bg-background ${
                           isScrolled
                              ? 'h-9 w-32 focus:w-48'
                              : 'h-10 w-48 focus:w-64'
                        }`}
                     />
                  </div>

                  <Link
                     href="/cart"
                     className="relative p-2 text-muted-foreground transition-transform hover:scale-110 hover:text-foreground"
                  >
                     <ShoppingBag className="h-5 w-5" />
                     <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
                        3
                     </span>
                  </Link>

                  <div className="hidden sm:block">
                     {isLoggedIn ? (
                        <button
                           className={`relative overflow-hidden rounded-full border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-glow ${
                              isScrolled ? 'h-8 w-8' : 'h-10 w-10'
                           }`}
                        >
                           <img
                              src="https://ui-avatars.com/api/?name=User&background=220 14% 8%&color=fff"
                              alt="Profile"
                              className="h-full w-full object-cover"
                           />
                        </button>
                     ) : (
                        <Link
                           href="/login"
                           className="hover-lift rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background shadow-sm transition-all hover:bg-noir"
                        >
                           Sign In
                        </Link>
                     )}
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
                  <div className="flex flex-col space-y-2 p-6">
                     {navLinks.map((link) => (
                        <Link
                           key={link.name}
                           href={link.href}
                           className="rounded-xl px-4 py-3 text-lg font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground text-center"
                           onClick={() => setIsMobileMenuOpen(false)}
                        >
                           {link.name}
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </header>
      </div>
   );
}
