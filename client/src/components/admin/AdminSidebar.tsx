'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
   LayoutDashboard,
   Package,
   ShoppingBag,
   Users,
   LogOut,
   Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
   isOpen: boolean;
   onClose: () => void;
}

const menuItems = [
   { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
   { icon: Package, label: 'Products', href: '/admin/products' },
   { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
   { icon: Users, label: 'Customers', href: '/admin/users' },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
   const pathname = usePathname();
   const { logout, user } = useAuth();

   return (
      <>
         {/* Backdrop for mobile */}
         {isOpen && (
            <div
               className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
               onClick={onClose}
            />
         )}

         <aside
            className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-border/50 bg-surface/50 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
               isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
         >
            <div className="flex h-full flex-col p-6">
               <div className="mb-10 flex items-center gap-3 px-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-glow">
                     <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                     <h1 className="font-display text-xl font-black tracking-tight text-foreground">
                        Volt<span className="text-accent italic">Edge</span>
                     </h1>
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                        Admin Portal
                     </p>
                  </div>
               </div>

               <nav className="flex-1 space-y-1.5">
                  {menuItems.map((item) => {
                     const isActive = pathname === item.href;
                     return (
                        <Link
                           key={item.href}
                           href={item.href}
                           onClick={onClose}
                           className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all ${
                              isActive
                                 ? 'bg-accent text-white shadow-glow'
                                 : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                           }`}
                        >
                           <item.icon
                              className={`h-5 w-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`}
                           />
                           {item.label}
                           {isActive && (
                              <motion.div
                                 layoutId="activeTab"
                                 className="absolute inset-0 rounded-2xl bg-accent -z-10"
                                 transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 0.6,
                                 }}
                              />
                           )}
                        </Link>
                     );
                  })}
               </nav>

               <div className="mt-auto space-y-4">
                  <div className="rounded-3xl border border-border/40 bg-background/50 p-4">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-accent/20 relative">
                           <Image
                              src={
                                 user?.avatar ||
                                 `https://ui-avatars.com/api/?name=${user?.name}&background=0D6EFD&color=fff`
                              }
                              alt={user?.name || 'User'}
                              fill
                              className="object-cover"
                           />
                        </div>
                        <div className="min-w-0">
                           <p className="truncate text-sm font-bold text-foreground">
                              {user?.name}
                           </p>
                           <p className="truncate text-[10px] font-medium text-muted-foreground">
                              {user?.email}
                           </p>
                        </div>
                     </div>
                  </div>

                  <button
                     onClick={logout}
                     className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-red-500 transition-all hover:bg-red-500/10"
                  >
                     <LogOut className="h-5 w-5" />
                     Logout
                  </button>
               </div>
            </div>
         </aside>
      </>
   );
}
