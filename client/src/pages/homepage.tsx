'use client';

import CameraFeature from '@/components/ui/cameraFeature';
import CategoryGrid from '@/components/ui/categoryGrid';
import HeroSection from '@/components/ui/heroSection';
import Newsletter from '@/components/ui/newsletter';
import Trending from '@/components/ui/trending';
import ValueProps from '@/components/ui/valueProps';

export default function Homepage() {
   return (
      <main className="relative flex flex-col">
         <HeroSection />
         <CategoryGrid />
         <CameraFeature />
         <Trending />
         <ValueProps />
         <Newsletter />
      </main>
   );
}
