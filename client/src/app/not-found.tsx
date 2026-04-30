'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, ZapOff } from 'lucide-react';

export default function NotFound() {
   const router = useRouter();

   return (
      // Removed the heavy py-24 padding. Let flexbox naturally center it!
      <main className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-background p-6 text-center">
         {/* Background Glow Effect - Made slightly more subtle and premium */}
         <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />

         <div className="z-10 flex flex-col items-center">
            {/* Themed Icon */}
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-border/50 bg-background/50 shadow-glow backdrop-blur-xl">
               <ZapOff className="h-10 w-10 text-accent" strokeWidth={1.5} />
            </div>

            {/* Massive 404 Text */}
            <h1 className="font-display text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]">
               <span className="bg-[image:var(--gradient-accent)] bg-clip-text text-transparent drop-shadow-sm">
                  404
               </span>
            </h1>

            {/* Copywriter / Text */}
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
               Signal lost.
            </h2>
            <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
               We couldn't find the page you're looking for. It might have been
               moved, deleted, or never existed in the first place.
            </p>

            {/* Call to Action Buttons */}
            <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
               {/* Secondary "Go Back" Button */}
               <button
                  onClick={() => router.back()}
                  className="group flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-surface px-8 py-3.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:border-foreground/20 hover:bg-muted sm:w-auto"
               >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  Go Back
               </button>

               {/* Primary "Home Screen" Button */}
               <Link
                  href="/"
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-noir hover:shadow-xl sm:w-auto"
               >
                  <Home className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  Home Screen
               </Link>
            </div>
         </div>

         {/* Decorative Grid/Lines */}
         <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </main>
   );
}
