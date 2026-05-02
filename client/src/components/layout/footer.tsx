import Link from 'next/link';
import { Zap } from 'lucide-react';

const Instagram = ({ className }: { className?: string }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
   </svg>
);

const Twitter = ({ className }: { className?: string }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
   </svg>
);

const Youtube = ({ className }: { className?: string }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 103.1 103.1 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 103.1 103.1 0 0 1-15 0 2 2 0 0 1-2-2Z" />
      <path d="m10 15 5-3-5-3v6Z" />
   </svg>
);

const footerLinks = [
   {
      title: 'Shop',
      links: [
         { name: 'Smartphones', href: '/smartphones' },
         { name: 'Audio', href: '/audio' },
         { name: 'Accessories', href: '/accessories' },
         { name: 'Deals', href: '/deals' },
      ],
   },
   {
      title: 'Support',
      links: [
         { name: 'Help Center', href: '/help' },
         { name: 'Track Order', href: '/track' },
         { name: 'Shipping', href: '/shipping' },
         { name: 'Returns', href: '/returns' },
      ],
   },
   {
      title: 'Company',
      links: [
         { name: 'About Us', href: '/about' },
         { name: 'Careers', href: '/careers' },
         { name: 'Privacy', href: '/privacy' },
         { name: 'Terms', href: '/terms' },
      ],
   },
];

export default function Footer() {
   return (
      <footer className="w-full bg-surface pt-12 pb-12 border-t border-border/40">
         <div className="container-px mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
               <div className="lg:col-span-4">
                  <Link href="/" className="flex items-center gap-2">
                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-glow">
                        <Zap
                           className="h-6 w-6 text-accent-foreground"
                           fill="currentColor"
                        />
                     </div>
                     <span className="font-display text-2xl font-black tracking-tighter text-foreground uppercase">
                        VoltEdge
                     </span>
                  </Link>
                  <p className="mt-6 max-w-xs text-sm font-medium leading-relaxed text-muted-foreground">
                     The definitive destination for pro-grade tech and
                     high-performance lifestyle gear. Elevate your reality.
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                     {[Instagram, Twitter, Youtube].map((Icon, i) => (
                        <Link
                           key={i}
                           href="#"
                           className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface/50 text-muted-foreground transition-all hover:border-accent hover:text-accent"
                        >
                           <Icon className="h-5 w-5" />
                        </Link>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
                  {footerLinks.map((section, idx) => (
                     <div key={idx} className="flex flex-col gap-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                           {section.title}
                        </h4>
                        <ul className="flex flex-col gap-4">
                           {section.links.map((link, i) => (
                              <li key={i}>
                                 <Link
                                    href={link.href}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                                 >
                                    {link.name}
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-border/40 sm:flex-row">
               <p className="text-xs font-medium text-muted-foreground">
                  © {new Date().getFullYear()} VoltEdge. All rights reserved.
               </p>
               <div className="flex items-center gap-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                     Designed for Performance
                  </span>
               </div>
            </div>
         </div>
      </footer>
   );
}
