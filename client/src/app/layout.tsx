import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

export const metadata: Metadata = {
   title: 'VoltEdge Store',
   description:
      'Implementation-ready e-commerce storefront for MacBook Neo and accessories.',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className="min-h-full flex flex-col">
            <CartProvider>
               <Toaster
                  position="bottom-right"
                  toastOptions={{
                     style: {
                        background: '#fff',
                        color: '#1a1a1a',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: '1px solid rgba(0,0,0,0.05)',
                     },
                     success: {
                        iconTheme: {
                           primary: '#3b82f6', // Use a clean brand blue
                           secondary: '#fff',
                        },
                     },
                  }}
               />
               {children}
            </CartProvider>
         </body>
      </html>
   );
}
