import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Aperture, Maximize, Video } from 'lucide-react';

const cameraFeatures = [
   {
      icon: Aperture,
      title: '48MP Variable Aperture',
      description:
         'The main Fusion camera physically adjusts its aperture for true optical bokeh and flawless low-light performance.',
   },
   {
      icon: Maximize,
      title: '48MP Tetraprism',
      description:
         'Massive 48MP sensor backing a 5x optical zoom, capturing staggering detail from a distance.',
   },
   {
      icon: Video,
      title: 'Spatial Video at 4K',
      description:
         'Record immersive, lifelike 3D video at 4K resolution to relive memories on Apple Vision Pro.',
   },
];

export default function CameraFeature() {
   return (
      <section className="relative flex w-full flex-col justify-center overflow-hidden bg-foreground pt-28 pb-12 lg:min-h-[80vh] lg:pt-26 lg:pb-18 xl:max-h-[800px]">
         <div className="container-px mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
               <div className="flex flex-col space-y-6 lg:space-y-8">
                  <div className="space-y-3">
                     <h2 className="font-display text-4xl font-black tracking-tighter text-background lg:text-5xl">
                        Pro camera system. <br />
                        <span className="bg-(image:--gradient-accent) bg-clip-text text-transparent">
                           Unreal reality.
                        </span>
                     </h2>
                     <p className="max-w-lg text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
                        Capture the world exactly as you see it. The iPhone 17
                        Pro introduces an entirely rebuilt 48MP triple-lens
                        array, featuring a mechanical variable aperture.
                     </p>
                  </div>

                  <div className="flex flex-col space-y-5">
                     {cameraFeatures.map((feature, index) => (
                        <div
                           key={index}
                           className="group flex items-start gap-4"
                        >
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition-colors duration-500 group-hover:bg-accent/20">
                              <feature.icon
                                 className="h-5 w-5 text-accent"
                                 strokeWidth={2}
                              />
                           </div>

                           <div className="flex flex-col pt-0.5">
                              <h4 className="text-lg font-bold text-background">
                                 {feature.title}
                              </h4>
                              <p className="text-sm font-medium leading-snug text-muted-foreground/80">
                                 {feature.description}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="pt-2">
                     <Link
                        href="/product/iphone-17-pro/camera"
                        className="group flex w-fit items-center gap-3 rounded-full bg-background px-6 py-3 text-sm font-bold text-foreground transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_hsl(var(--background)/0.15)]"
                     >
                        Explore Camera
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                     </Link>
                  </div>
               </div>

               <div className="relative w-full">
                  <div className="group relative mx-auto aspect-square w-full max-w-[600px] overflow-hidden rounded-4xl shadow-2xl lg:aspect-4/3 xl:aspect-4/3.5">
                     <Image
                        src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop"
                        alt="Shot on iPhone 17 Pro"
                        fill
                        className="object-cover transition-transform duration-1000 ease-(--ease-spring) group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                     />

                     <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-80" />

                     <div className="glass-dark absolute bottom-4 left-4 flex items-center gap-3 rounded-xl px-4 py-2 shadow-xl backdrop-blur-xl transition-transform duration-500 ease-(--ease-spring) group-hover:-translate-y-1 sm:bottom-6 sm:left-6">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow animate-pulse" />
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                              Unedited
                           </span>
                           <span className="font-display text-xs font-semibold text-white">
                              Shot on iPhone 17 Pro
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="absolute -right-10 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/20 blur-[80px]" />
               </div>
            </div>
         </div>
      </section>
   );
}
