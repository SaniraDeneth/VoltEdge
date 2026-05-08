'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
   Truck,
   User,
   Mail,
   MapPin,
   Phone,
   Globe,
   ArrowRight,
   Check,
} from 'lucide-react';

interface ShippingData {
   firstName: string;
   lastName: string;
   email: string;
   address: string;
   city: string;
   zipCode: string;
   phone: string;
}

interface ShippingFormProps {
   data: ShippingData;
   onChange: (field: keyof ShippingData, value: string) => void;
   onNext: () => void;
}

export default function ShippingForm({
   data,
   onChange,
   onNext,
}: ShippingFormProps) {
   const { user } = useAuth();
   const [useSaved, setUseSaved] = useState(false);

   const hasSavedAddress = !!user?.shippingAddress?.address;

   const handleToggleSaved = () => {
      const newValue = !useSaved;
      setUseSaved(newValue);

      if (newValue && user?.shippingAddress) {
         const nameParts = user.name.split(' ');
         const firstName = nameParts[0] || '';
         const lastName = nameParts.slice(1).join(' ') || '';

         onChange('firstName', firstName);
         onChange('lastName', lastName);
         onChange('email', user.email);
         onChange('address', user.shippingAddress.address);
         onChange('city', user.shippingAddress.city);
         onChange('zipCode', user.shippingAddress.zipCode);
         if (user.phone) onChange('phone', user.phone);
      }
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onNext();
   };

   return (
      <motion.div
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         exit={{ opacity: 0, x: -20 }}
         className="w-full max-w-xl mx-auto"
      >
         <div className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-accent/10 rounded-[1.25rem]">
                     <Truck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                     <h2 className="font-display text-2xl font-bold text-foreground">
                        Shipping Details
                     </h2>
                     <p className="text-muted-foreground text-sm font-medium">
                        Where should we send your tech?
                     </p>
                  </div>
               </div>

               {hasSavedAddress && (
                  <button
                     type="button"
                     onClick={handleToggleSaved}
                     className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
                        useSaved
                           ? 'bg-foreground text-background border-foreground shadow-lg'
                           : 'bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                     }`}
                  >
                     <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${useSaved ? 'bg-accent border-accent' : 'border-current'}`}
                     >
                        {useSaved && <Check className="w-3 h-3 text-white" />}
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">
                        Saved Address
                     </span>
                  </button>
               )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                        First Name
                     </label>
                     <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input
                           required
                           value={data.firstName}
                           onChange={(e) =>
                              onChange('firstName', e.target.value)
                           }
                           className="w-full bg-background border border-border/60 rounded-2xl py-4 pl-14 pr-5 text-foreground font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                           placeholder="John"
                        />
                     </div>
                  </div>
                  <div className="space-y-2.5">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                        Last Name
                     </label>
                     <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input
                           required
                           value={data.lastName}
                           onChange={(e) =>
                              onChange('lastName', e.target.value)
                           }
                           className="w-full bg-background border border-border/60 rounded-2xl py-4 pl-14 pr-5 text-foreground font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                           placeholder="Doe"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                     Email Address
                  </label>
                  <div className="relative group">
                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                     <input
                        required
                        type="email"
                        value={data.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-2xl py-4 pl-14 pr-5 text-foreground font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                        placeholder="john@example.com"
                     />
                  </div>
               </div>

               <div className="space-y-2.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                     Shipping Address
                  </label>
                  <div className="relative group">
                     <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                     <input
                        required
                        value={data.address}
                        onChange={(e) => onChange('address', e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-2xl py-4 pl-14 pr-5 text-foreground font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                        placeholder="123 Street Name"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                        City
                     </label>
                     <div className="relative group">
                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input
                           required
                           value={data.city}
                           onChange={(e) => onChange('city', e.target.value)}
                           className="w-full bg-background border border-border/60 rounded-2xl py-4 pl-14 pr-5 text-foreground font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                           placeholder="New York"
                        />
                     </div>
                  </div>
                  <div className="space-y-2.5">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                        Zip Code
                     </label>
                     <input
                        required
                        pattern="\d{5}"
                        title="Zip code must be exactly 5 digits"
                        value={data.zipCode}
                        onChange={(e) => onChange('zipCode', e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-2xl py-4 px-5 text-foreground font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                        placeholder="10001"
                     />
                  </div>
               </div>

               <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                     Phone Number
                  </label>
                  <div className="relative group">
                     <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                     <input
                        required
                        type="tel"
                        pattern="^\+?[1-9]\d{7,14}$"
                        title="Please enter a valid phone number (e.g., +94771234567)"
                        value={data.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-2xl py-4 pl-14 pr-5 text-foreground font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                        placeholder="+94 771 234 567"
                     />
                  </div>
               </div>

               <button
                  type="submit"
                  className="group relative w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground py-5 font-black uppercase tracking-widest text-background transition-all hover:bg-noir hover:shadow-2xl active:scale-[0.98] mt-6"
               >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                     Review Order
                     <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
               </button>
            </form>
         </div>
      </motion.div>
   );
}
