'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Zap, Loader2, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { login } = useAuth();
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         await login({ email, password });
         // The login function in AuthContext redirects to '/',
         // but we want to go to /admin/dashboard if it's an admin.
         // We might need to adjust AuthContext or handle it here.
         router.push('/admin/dashboard');
      } catch (err) {
         console.error(err);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-hero px-6">
         <div className="w-full max-w-md">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-surface/50 backdrop-blur-3xl border border-border/50 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent blur-[80px] -mr-16 -mt-16 opacity-10" />

               <div className="text-center mb-10">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-glow">
                     <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="font-display text-3xl font-black tracking-tight text-foreground">
                     Volt<span className="text-accent italic">Edge</span>
                  </h1>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                     Admin Control Center
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                     <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input
                           type="email"
                           placeholder="Administrator Email"
                           required
                           className="w-full rounded-2xl border border-border/50 bg-white/60 backdrop-blur-md py-4 pl-12 pr-4 text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input
                           type="password"
                           placeholder="Access Key"
                           required
                           className="w-full rounded-2xl border border-border/50 bg-white/60 backdrop-blur-md py-4 pl-12 pr-4 text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                     </div>
                  </div>

                  <button
                     disabled={isLoading}
                     type="submit"
                     className="group relative w-full overflow-hidden rounded-2xl bg-foreground py-4 font-bold text-background transition-all hover:bg-noir hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                  >
                     <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                           <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Verifying...
                           </>
                        ) : (
                           <>
                              Authenticate
                              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                           </>
                        )}
                     </span>
                     <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  </button>
               </form>

               <div className="mt-10 pt-8 border-t border-border/20 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                     Internal Use Only • VoltEdge Systems
                  </p>
               </div>
            </motion.div>
         </div>
      </main>
   );
}
