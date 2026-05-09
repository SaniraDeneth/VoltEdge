import React from 'react';

export default function ProductCardSkeleton() {
   return (
      <div className="relative w-full overflow-hidden rounded-4xl bg-surface border border-white/5 animate-pulse">
         <div className="relative aspect-[10/13] w-full overflow-hidden rounded-4xl p-6 flex flex-col justify-between bg-gradient-to-t from-noir/80 via-noir/10 to-transparent">
            {/* Top Bar Skeleton */}
            <div className="flex items-start justify-between relative z-10 w-full">
               <div className="flex flex-col gap-1.5 w-1/3">
                  {/* Category Badge Skeleton */}
                  <div className="h-5 rounded-full bg-white/10 border border-white/5" />
               </div>

               {/* Availability Skeleton */}
               <div className="h-5 w-24 rounded-full bg-white/10 border border-white/5" />
            </div>

            {/* Bottom Content Skeleton */}
            <div className="flex flex-col gap-4 relative z-10 w-full mt-auto">
               {/* Title Skeleton */}
               <div className="space-y-2">
                  <div className="h-6 w-3/4 rounded-lg bg-white/20" />
                  <div className="h-6 w-1/2 rounded-lg bg-white/20" />
               </div>

               {/* Divider and Price Skeleton */}
               <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-1">
                  <div className="flex flex-col gap-1.5 w-1/2">
                     <div className="h-3 w-16 rounded bg-white/10" />
                     <div className="h-6 w-24 rounded-lg bg-white/20" />
                  </div>

                  {/* Circular Arrow Button Skeleton */}
                  <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10" />
               </div>
            </div>
         </div>
      </div>
   );
}
