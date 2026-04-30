'use client';

import CameraFeature from '@/components/ui/cameraFeature';
import CategoryGrid from '@/components/ui/categoryGrid';
import HeroSection from '@/components/ui/heroSection';

export default function Homepage() {
   return (
      <>
         <HeroSection />
         <CategoryGrid />
         <CameraFeature />
      </>
   );
}
