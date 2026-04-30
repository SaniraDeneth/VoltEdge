import type { Metadata } from 'next';
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
         <body className="min-h-full flex flex-col">{children}</body>
      </html>
   );
}
