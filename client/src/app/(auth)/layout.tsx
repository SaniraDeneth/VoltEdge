import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, ShieldCheck, Globe, CreditCard } from 'lucide-react';

export default function AuthLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4 sm:p-6">
         {/* Background Image Layer */}
         <div className="absolute inset-0 z-0">
            <Image
               src="/auth_background.png"
               alt="Auth Background"
               fill
               className="object-cover opacity-[0.5] grayscale invert brightness-110"
               priority
            />
            <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[2px]" />

            {/* Soft Glow Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
         </div>

         <div className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            {/* Left Side: Info/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-between p-10 bg-slate-50/50 border-r border-slate-100">
               <div>
                  <Link href="/" className="flex items-center gap-3 group">
                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-sm transition-transform group-hover:rotate-12">
                        <Zap className="h-5 w-5 text-accent-foreground" />
                     </div>
                     <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
                        Volt<span className="text-accent">Edge</span>
                     </span>
                  </Link>

                  <div className="mt-16 space-y-6">
                     <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 leading-[1.2]">
                        Discover the Best in <br />
                        <span className="text-accent">Electronics</span>.
                     </h2>
                     <p className="text-base text-slate-500 max-w-sm leading-relaxed">
                        Your premium online destination to explore, compare, and
                        purchase high-quality electronic products with ease.
                     </p>

                     <div className="pt-6 space-y-4">
                        {[
                           { icon: ShieldCheck, text: 'Secure Transactions' },
                           { icon: Globe, text: 'Worldwide Shipping' },
                           { icon: CreditCard, text: 'Flexible Payments' },
                        ].map((item, idx) => (
                           <div
                              key={idx}
                              className="flex items-center gap-3 text-slate-600"
                           >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
                                 <item.icon className="h-4 w-4 text-accent" />
                              </div>
                              <span className="text-sm font-semibold">
                                 {item.text}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-200/60">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                     &copy; 2026 VoltEdge Store. All Rights Reserved.
                  </p>
               </div>
            </div>

            {/* Right Side: Form Content */}
            <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
               <div className="lg:hidden mb-8 flex justify-center">
                  <Link href="/" className="flex items-center gap-3">
                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-sm">
                        <Zap className="h-5 w-5 text-accent-foreground" />
                     </div>
                  </Link>
               </div>
               {children}
            </div>
         </div>
      </div>
   );
}
