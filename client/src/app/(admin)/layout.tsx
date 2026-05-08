'use client';

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminGuard from '@/components/admin/AdminGuard';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

export default function AdminLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const pathname = usePathname();
   const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
   const isLoginPage = pathname === '/admin/login';

   if (isLoginPage) {
      return <>{children}</>;
   }

   return (
      <AdminGuard>
         <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <AdminSidebar
               isOpen={isSidebarOpen}
               onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
               {/* Mobile Header */}
               <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/50 px-6 backdrop-blur-xl lg:hidden">
                  <div className="flex items-center gap-2">
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                        <Menu className="h-5 w-5 text-white" />
                     </div>
                     <span className="font-display text-lg font-black tracking-tight text-foreground">
                        Volt<span className="text-accent italic">Edge</span>
                     </span>
                  </div>
                  <button
                     onClick={() => setIsSidebarOpen(true)}
                     className="rounded-xl bg-surface p-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                     <Menu className="h-6 w-6" />
                  </button>
               </header>

               <main className="flex-1 lg:pl-72">
                  <div className="p-6 md:p-10">{children}</div>
               </main>
            </div>
         </div>
      </AdminGuard>
   );
}
