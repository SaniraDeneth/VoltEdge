import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

const props = [
   {
      icon: Truck,
      title: 'Free Express Shipping',
      description: 'On all orders over $999.',
   },
   {
      icon: ShieldCheck,
      title: 'Secure Payments',
      description: 'Fully encrypted transaction protocols.',
   },
   {
      icon: Headphones,
      title: '24/7 Premium Support',
      description: 'Dedicated tech experts at your service.',
   },
   {
      icon: RefreshCw,
      title: 'Easy 30-Day Returns',
      description: 'No questions asked return policy.',
   },
];

export default function ValueProps() {
   return (
      <section className="w-full bg-surface/30 backdrop-blur-sm py-16">
         <div className="container-px mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
               {props.map((prop, index) => (
                  <div
                     key={index}
                     className="flex items-center gap-4 px-4 sm:justify-center"
                  >
                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                        <prop.icon
                           className="h-6 w-6 text-accent"
                           strokeWidth={1.5}
                        />
                     </div>
                     <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-foreground">
                           {prop.title}
                        </h4>
                        <p className="text-xs font-medium text-muted-foreground">
                           {prop.description}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
