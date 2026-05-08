'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, isLoading, isAuthenticated } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!isLoading) {
         if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/admin/login');
         }
      }
   }, [isLoading, isAuthenticated, user, router]);

   if (isLoading) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
         </div>
      );
   }

   if (!isAuthenticated || user?.role !== 'admin') {
      return null;
   }

   return <>{children}</>;
}
