'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { orderApi } from '@/lib/api-client';
import { Order } from '@/types';
import {
   Package,
   ChevronRight,
   Clock,
   CheckCircle2,
   Truck,
   XCircle,
   Loader2,
   Search,
   Calendar,
   ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const statusConfig = {
   pending: {
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      label: 'Pending',
   },
   processing: {
      icon: Loader2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      label: 'Processing',
   },
   shipped: {
      icon: Truck,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      label: 'Shipped',
   },
   delivered: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      label: 'Delivered',
   },
   cancelled: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      label: 'Cancelled',
   },
};

export default function OrdersPage() {
   const [orders, setOrders] = useState<Order[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const router = useRouter();

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const data = await orderApi.getAll();
            setOrders(data);
         } catch (error) {
            console.error('Failed to fetch orders', error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchOrders();
   }, []);

   const filteredOrders = orders.filter(
      (order) =>
         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
         order.status.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <main className="min-h-screen bg-gradient-hero pt-32 pb-20 px-6">
         <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
               <div>
                  <button
                     onClick={() => router.back()}
                     className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 font-black text-[10px] uppercase tracking-[0.2em]"
                  >
                     <ArrowLeft className="w-4 h-4" />
                     Back
                  </button>
                  <h1 className="font-display text-5xl font-bold text-foreground tracking-tight uppercase">
                     Order <span className="text-accent italic">History</span>
                  </h1>
               </div>

               <div className="relative w-full md:w-80 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input
                     type="text"
                     placeholder="Search order ID or status..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-surface/50 backdrop-blur-xl border border-border/50 rounded-full py-4 pl-14 pr-6 text-foreground font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                  />
               </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
               {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-6">
                     <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-accent/10 border-t-accent animate-spin" />
                        <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent" />
                     </div>
                     <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em]">
                        Synchronizing with Warehouse...
                     </p>
                  </div>
               ) : filteredOrders.length === 0 ? (
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[3rem] p-16 text-center"
                  >
                     <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-8 text-muted-foreground/30">
                        <Package className="w-12 h-12" />
                     </div>
                     <h2 className="text-2xl font-bold text-foreground mb-3">
                        No orders found
                     </h2>
                     <p className="text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                        {searchQuery
                           ? `We couldn't find any orders matching "${searchQuery}".`
                           : "You haven't placed any orders yet. Ready to start your collection?"}
                     </p>
                     {!searchQuery && (
                        <button
                           onClick={() => router.push('/products')}
                           className="bg-accent/10 text-accent border border-accent/20 px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/20 transition-all shadow-xl active:scale-[0.98]"
                        >
                           Explore Products
                        </button>
                     )}
                  </motion.div>
               ) : (
                  filteredOrders.map((order, index) => {
                     const status =
                        statusConfig[order.status as keyof typeof statusConfig];
                     const StatusIcon = status.icon;

                     return (
                        <motion.div
                           key={order.id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.05 }}
                           className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-accent/20 transition-all group relative overflow-hidden"
                        >
                           {/* Subtle background ID */}
                           <div className="absolute -right-4 -bottom-4 text-9xl font-black text-foreground/5 select-none pointer-events-none group-hover:text-accent/5 transition-colors">
                              #{order.id.slice(-4).toUpperCase()}
                           </div>

                           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                              <div className="flex items-center gap-8">
                                 <div
                                    className={`w-20 h-20 rounded-3xl ${status.bg} flex items-center justify-center ${status.color} shadow-inner`}
                                 >
                                    <StatusIcon
                                       className={`w-10 h-10 ${order.status === 'processing' ? 'animate-spin' : ''}`}
                                    />
                                 </div>

                                 <div>
                                    <div className="flex items-center gap-3 mb-2">
                                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-3 py-1 bg-muted/20 rounded-full">
                                          Order #
                                          {order.id.slice(-8).toUpperCase()}
                                       </span>
                                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(
                                             order.createdAt
                                          ).toLocaleDateString()}
                                       </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tight">
                                       ${order.totalAmount.toLocaleString()}
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium">
                                       {order.items.length}{' '}
                                       {order.items.length === 1
                                          ? 'Item'
                                          : 'Items'}{' '}
                                       in this package
                                    </p>
                                 </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                                 <div
                                    className={`w-full sm:w-48 px-6 py-4 rounded-2xl ${status.bg} ${status.color} font-black text-[10px] uppercase tracking-[0.2em] text-center border border-current/10`}
                                 >
                                    {status.label}
                                 </div>
                                 <Link
                                    href={`/orders/${order.id}`}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-surface border border-border/50 text-foreground px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-all active:scale-[0.98]"
                                 >
                                    View Details
                                    <ChevronRight className="w-4 h-4" />
                                 </Link>
                              </div>
                           </div>

                           {/* Dynamic Progress Indicator */}
                           <div className="mt-10 relative">
                              <div className="h-1.5 bg-muted/20 w-full rounded-full overflow-hidden">
                                 <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                       width:
                                          order.status === 'pending'
                                             ? '15%'
                                             : order.status === 'processing'
                                               ? '40%'
                                               : order.status === 'shipped'
                                                 ? '70%'
                                                 : order.status === 'delivered'
                                                   ? '100%'
                                                   : '0%',
                                    }}
                                    transition={{
                                       duration: 1.5,
                                       ease: 'easeOut',
                                    }}
                                    className={`h-full ${status.color.replace('text', 'bg')} shadow-glow`}
                                 />
                              </div>
                              <div className="flex justify-between mt-3">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                                    Registered
                                 </span>
                                 <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                                    Transit
                                 </span>
                                 <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                                    Delivered
                                 </span>
                              </div>
                           </div>
                        </motion.div>
                     );
                  })
               )}
            </div>
         </div>
      </main>
   );
}
