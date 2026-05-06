import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
   title: 'VoltEdge Store',
   description: 'High-performance technology marketplace.',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className="antialiased">
            <AuthProvider>
               <CartProvider>
                  <div className="relative flex min-h-screen flex-col bg-background">
                     <main className="flex-1">{children}</main>
                  </div>
                  <Toaster
                     position="bottom-right"
                     toastOptions={{
                        className: 'glass-dark text-white border-white/10',
                        duration: 4000,
                     }}
                  />
               </CartProvider>
            </AuthProvider>
         </body>
      </html>
   );
}
