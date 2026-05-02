import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
   return (
      <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-(image:--gradient-hero) pt-15">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] h-[40vw] w-[60vw] rounded-full bg-accent/15 blur-[120px] pointer-events-none"></div>
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] h-[20vw] w-[30vw] rounded-full bg-accent-glow/20 blur-[80px] pointer-events-none"></div>

         <div className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col justify-center">
            <div className="absolute left-0 top-12 z-40 flex w-full justify-between px-6 lg:px-8">
               <div className="flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-surface hover:text-foreground cursor-default">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <span>New · iPhone 17 Pro</span>
               </div>

               <Link
                  href="/product/iphone-17-pro"
                  className="group hover-lift flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-bold text-background shadow-lg transition-all hover:bg-noir"
               >
                  BUY NOW
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </Link>
            </div>

            <div className="relative z-10 flex flex-col text-center -translate-y-12 lg:-translate-y-20">
               <h1 className="font-display text-[15vw] font-black leading-[0.85] tracking-tighter text-foreground lg:text-[11vw] 2xl:text-[13rem]">
                  UNLIMITED
               </h1>
               <h1
                  className="font-display text-[15vw] font-black leading-[0.9] tracking-tighter text-transparent drop-shadow-sm lg:text-[11vw] 2xl:text-[13rem]"
                  style={{
                     WebkitTextStroke: '2px hsl(var(--foreground) / 0.15)',
                  }}
               >
                  POWER
               </h1>
            </div>

            <div className="absolute left-1/2 top-1/2 z-30 w-[65vw] max-w-[320px] -translate-x-1/2 -translate-y-[55%] sm:w-[45vw] lg:max-w-[420px]">
               <img
                  src="/hero-phone.png"
                  alt="iPhone 15 Pro"
                  className="h-auto w-full -rotate-10 transition-transform duration-1000 ease-(--ease-spring) hover:-rotate-5 scale-90 opacity-95 hover:scale-95"
                  style={{
                     filter:
                        'drop-shadow(20px 30px 40px rgba(0,0,0,0.35)) drop-shadow(0 0 80px hsl(var(--accent) / 0.15))',
                  }}
               />
            </div>

            <div className="absolute bottom-8 left-0 z-40 flex w-full flex-col justify-between gap-6 px-6 lg:px-8 lg:flex-row lg:items-end">
               <div className="flex flex-col">
                  <span className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                     Aluminum Design
                  </span>
                  <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                     iPhone 17 Pro
                  </h2>
               </div>

               <div className="max-w-[280px] lg:text-right">
                  <p className="text-balance text-sm font-medium text-muted-foreground">
                     Forged in aluminum. <br className="hidden lg:block" />
                     A19 Pro chip. A monster win for gaming.
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}
