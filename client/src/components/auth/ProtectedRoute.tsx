'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
   const { isAuthenticated, isLoading } = useAuth();
   const router = useRouter();
   const pathname = usePathname();

   useEffect(() => {
      if (!isLoading && !isAuthenticated) {
         router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
   }, [isAuthenticated, isLoading, router, pathname]);

   if (isLoading) {
      return (
         <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
         </div>
      );
   }

   if (!isAuthenticated) {
      return null;
   }

   return <>{children}</>;
}
