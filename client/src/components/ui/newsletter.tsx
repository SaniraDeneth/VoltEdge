import { Send } from 'lucide-react';

export default function Newsletter() {
   return (
      <section className="container-px mx-auto w-full max-w-7xl">
         <div
            className="relative overflow-hidden rounded-[3rem] px-8 py-16 text-center sm:px-16 lg:py-24"
            style={{ backgroundColor: 'hsl(var(--noir))' }}
         >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-2xl">
               <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Join the Edge.
               </h2>
               <p className="mt-6 text-lg font-medium text-white/60">
                  Stay updated with the latest tech drops, exclusive offers, and
                  pro-grade gear. Get 10% off your first order.
               </p>

               <form className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                     <input
                        type="email"
                        placeholder="Enter your email"
                        className="h-14 w-full rounded-full border border-white/10 bg-white/5 px-6 text-white outline-none transition-all focus:border-accent/50 focus:bg-white/10"
                        required
                     />
                  </div>
                  <button
                     type="submit"
                     className="group flex h-14 items-center justify-center gap-2 rounded-full bg-accent px-8 font-bold text-accent-foreground transition-all hover:scale-105 active:scale-95"
                  >
                     Subscribe
                     <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
               </form>

               <p className="mt-6 text-xs text-white/40">
                  By subscribing, you agree to our Privacy Policy and Terms of
                  Service.
               </p>
            </div>
         </div>
      </section>
   );
}
