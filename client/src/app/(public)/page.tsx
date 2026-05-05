import CameraFeature from '@/components/home/cameraFeature';
import CategoryGrid from '@/components/home/categoryGrid';
import HeroSection from '@/components/home/heroSection';
import Newsletter from '@/components/home/newsletter';
import NewArrivals from '@/components/home/newArrivals';
import ValueProps from '@/components/home/valueProps';

export default function page() {
   return (
      <main className="relative flex flex-col">
         <HeroSection />
         <CategoryGrid />
         <CameraFeature />
         <NewArrivals />
         <ValueProps />
         <Newsletter />
      </main>
   );
}
