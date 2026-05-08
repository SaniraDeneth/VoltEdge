'use client';

import { useState, useEffect } from 'react';
import {
   DollarSign,
   Package,
   ShoppingBag,
   Users,
   ArrowUpRight,
   ArrowDownRight,
   TrendingUp,
   Clock,
   CheckCircle2,
   Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api-client';
import { Order, User } from '@/types';

const statusStyles = {
   delivered: 'bg-emerald-500/10 text-emerald-500',
   processing: 'bg-blue-500/10 text-blue-500',
   pending: 'bg-amber-500/10 text-amber-500',
   shipped: 'bg-purple-500/10 text-purple-500',
   cancelled: 'bg-red-500/10 text-red-500',
};

export default function AdminDashboardPage() {
   const [data, setData] = useState<{
      totalRevenue: number;
      revenueChange: number;
      totalOrders: number;
      ordersChange: number;
      totalProducts: number;
      totalUsers: number;
      usersChange: number;
      recentOrders: Order[];
   } | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const stats = await adminApi.getStats();
            setData(stats);
         } catch (error) {
            console.error('Failed to fetch admin stats', error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchStats();
   }, []);

   if (isLoading) {
      return (
         <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
         </div>
      );
   }

   if (!data) return null;

   const stats = [
      {
         label: 'Total Revenue',
         value: `$${data.totalRevenue.toLocaleString()}`,
         change: `${data.revenueChange >= 0 ? '+' : ''}${data.revenueChange}%`,
         isPositive: data.revenueChange >= 0,
         icon: DollarSign,
         color: 'text-emerald-500',
         bg: 'bg-emerald-500/10',
      },
      {
         label: 'Total Orders',
         value: data.totalOrders.toString(),
         change: `${data.ordersChange >= 0 ? '+' : ''}${data.ordersChange}%`,
         isPositive: data.ordersChange >= 0,
         icon: ShoppingBag,
         color: 'text-blue-500',
         bg: 'bg-blue-500/10',
      },
      {
         label: 'Active Products',
         value: data.totalProducts.toString(),
         change: 'Live',
         isPositive: true,
         icon: Package,
         color: 'text-amber-500',
         bg: 'bg-amber-500/10',
      },
      {
         label: 'Normal Users',
         value: data.totalUsers.toString(),
         change: `${data.usersChange >= 0 ? '+' : ''}${data.usersChange}%`,
         isPositive: data.usersChange >= 0,
         icon: Users,
         color: 'text-purple-500',
         bg: 'bg-purple-500/10',
      },
   ];
   return (
      <div className="space-y-10">
         <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
               Dashboard <span className="text-accent italic">Overview</span>
            </h1>
            <p className="text-muted-foreground font-medium">
               Welcome back, Administrator. Here's what's happening today.
            </p>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
               <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-surface/50 p-8 transition-all hover:bg-surface hover:shadow-lg"
               >
                  <div className="flex items-center justify-between mb-4">
                     <div
                        className={`rounded-2xl ${stat.bg} p-3 ${stat.color}`}
                     >
                        <stat.icon className="h-6 w-6" />
                     </div>
                     <div
                        className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}
                     >
                        {stat.isPositive ? (
                           <ArrowUpRight className="h-4 w-4" />
                        ) : (
                           <ArrowDownRight className="h-4 w-4" />
                        )}
                        {stat.change}
                     </div>
                  </div>
                  <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-1">
                     {stat.label}
                  </p>
                  <p className="text-3xl font-black text-foreground">
                     {stat.value}
                  </p>
               </motion.div>
            ))}
         </div>

         <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Recent Orders */}
            <div className="lg:col-span-8">
               <div className="rounded-[2.5rem] border border-border/50 bg-surface/50 p-8">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-xl font-bold text-foreground tracking-tight uppercase flex items-center gap-3">
                        <Clock className="w-5 h-5 text-accent" />
                        Recent Orders
                     </h2>
                     <button className="text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:underline">
                        View All
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b border-border/20">
                              <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                 Order ID
                              </th>
                              <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                 Customer
                              </th>
                              <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                 Total
                              </th>
                              <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                 Status
                              </th>
                              <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                 Date
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                           {data.recentOrders.map((order) => {
                              const customer = order.userId as unknown as User;
                              return (
                                 <tr
                                    key={order.id}
                                    className="group transition-colors hover:bg-background/40"
                                 >
                                    <td className="py-5 font-bold text-sm uppercase">
                                       #{order.id.slice(-6)}
                                    </td>
                                    <td className="py-5 text-sm font-medium">
                                       {customer?.name || 'Guest User'}
                                    </td>
                                    <td className="py-5 text-sm font-bold text-accent">
                                       ${order.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="py-5">
                                       <span
                                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusStyles[order.status as keyof typeof statusStyles]}`}
                                       >
                                          {order.status}
                                       </span>
                                    </td>
                                    <td className="py-5 text-sm text-muted-foreground">
                                       {new Date(
                                          order.createdAt
                                       ).toLocaleDateString()}
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Performance Overview */}
            <div className="lg:col-span-4">
               <div className="rounded-[2.5rem] border border-border/50 bg-surface/50 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent blur-[80px] -mr-16 -mt-16 opacity-10" />
                  <h2 className="text-xl font-bold tracking-tight uppercase mb-8 flex items-center gap-3 relative z-10 text-foreground">
                     <TrendingUp className="w-5 h-5 text-accent" />
                     Growth Rate
                  </h2>
                  <div className="relative z-10">
                     <p className="text-6xl font-black tracking-tighter mb-2 text-foreground">
                        {data.revenueChange >= 0 ? '+' : ''}
                        {data.revenueChange}%
                     </p>
                     <p className="text-sm font-medium text-muted-foreground mb-8 leading-relaxed">
                        Your store's performance is currently{' '}
                        {data.revenueChange >= 0 ? 'increasing' : 'decreasing'}{' '}
                        based on monthly revenue comparison.
                     </p>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                           <span>Efficiency</span>
                           <span>92%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                           <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '92%' }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-accent shadow-glow"
                           />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-8 rounded-[2.5rem] border border-border/50 bg-accent p-8 text-white shadow-glow transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                     <div className="rounded-2xl bg-white/20 p-3">
                        <CheckCircle2 className="h-6 w-6" />
                     </div>
                     <div>
                        <h3 className="font-bold tracking-tight text-lg">
                           System Status
                        </h3>
                        <p className="text-sm font-medium text-white/80">
                           All operations normal
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
