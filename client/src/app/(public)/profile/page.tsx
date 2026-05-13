'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { orderApi } from '@/lib/api-client';
import { Order } from '@/types';
import {
   User as UserIcon,
   Package,
   MapPin,
   Phone,
   Settings,
   ChevronRight,
   Clock,
   CheckCircle2,
   Truck,
   XCircle,
   AlertCircle,
   ArrowRight,
   Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function ProfilePage() {
   const router = useRouter();
   const { user, updateProfile } = useAuth();
   const [orders, setOrders] = useState<Order[]>([]);
   const [isLoadingOrders, setIsLoadingOrders] = useState(true);
   const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
   const [isEditing, setIsEditing] = useState(false);

   // Form state
   const [formData, setFormData] = useState({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.shippingAddress?.address || '',
      city: user?.shippingAddress?.city || '',
      zipCode: user?.shippingAddress?.zipCode || '',
   });

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const data = await orderApi.getAll();
            setOrders(data);
         } catch (error) {
            console.error('Failed to fetch orders', error);
         } finally {
            setIsLoadingOrders(false);
         }
      };

      if (user) fetchOrders();
   }, [user]);

   const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateProfile({
         name: formData.name,
         phone: formData.phone,
         shippingAddress: {
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
         },
      });
      setIsEditing(false);
   };

   const isProfileIncomplete = !user?.phone || !user?.shippingAddress?.address;

   if (!user) return null;

   return (
      <main className="min-h-screen bg-gradient-hero pt-32 pb-20 px-6">
         <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
               <div className="flex items-center gap-6">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                        <Image
                           src={
                              user.avatar ||
                              `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                           }
                           alt={user.name}
                           width={96}
                           height={96}
                           className="object-cover"
                        />
                     </div>
                     <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white" />
                  </div>
                  <div>
                     <h1 className="font-display text-4xl font-bold text-foreground tracking-tight uppercase">
                        {user.name}
                     </h1>
                     <p className="text-muted-foreground font-medium">
                        {user.email}
                     </p>
                  </div>
               </div>

               <div className="flex items-center bg-surface/40 backdrop-blur-xl border border-border/50 rounded-full p-1.5 p-x-4">
                  <button
                     onClick={() => setActiveTab('orders')}
                     className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'orders' ? 'bg-accent text-white shadow-glow' : 'text-muted-foreground/60 hover:text-foreground'}`}
                  >
                     <Package className="w-4 h-4" />
                     Orders
                  </button>
                  <button
                     onClick={() => setActiveTab('settings')}
                     className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'settings' ? 'bg-accent text-white shadow-glow' : 'text-muted-foreground/60 hover:text-foreground'}`}
                  >
                     <Settings className="w-4 h-4" />
                     Settings
                  </button>
               </div>
            </div>

            {/* Setup Prompt */}
            <AnimatePresence>
               {isProfileIncomplete && activeTab === 'orders' && (
                  <motion.div
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="mb-12 bg-accent/5 border border-accent/20 rounded-[2.5rem] p-8 relative overflow-hidden group"
                  >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                     <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-5">
                           <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                              <AlertCircle className="w-8 h-8 text-accent" />
                           </div>
                           <div>
                              <h3 className="font-display text-xl font-bold text-foreground mb-1 tracking-tight">
                                 Complete Your Profile
                              </h3>
                              <p className="text-muted-foreground font-medium">
                                 Add your shipping details now to speed up your
                                 next checkout.
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => setActiveTab('settings')}
                           className="group flex items-center gap-3 bg-accent/10 text-accent border border-accent/20 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/20 transition-all active:scale-[0.98]"
                        >
                           Setup Profile
                           <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Left Column: Quick Info */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-surface/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 shadow-xl">
                     <h3 className="font-display text-xl font-bold text-foreground mb-8">
                        Personal Info
                     </h3>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                              <UserIcon className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-0.5">
                                 Full Name
                              </p>
                              <p className="text-foreground font-bold">
                                 {user.name}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                              <Phone className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-0.5">
                                 Phone Number
                              </p>
                              <p className="text-foreground font-bold">
                                 {user.phone || 'Not set'}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground mt-1">
                              <MapPin className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-0.5">
                                 Shipping Address
                              </p>
                              <p className="text-foreground font-bold leading-relaxed">
                                 {user.shippingAddress?.address ? (
                                    <>
                                       {user.shippingAddress.address}
                                       <br />
                                       {user.shippingAddress.city},{' '}
                                       {user.shippingAddress.zipCode}
                                    </>
                                 ) : (
                                    'Not set'
                                 )}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column: Tab Content */}
               <div className="lg:col-span-8">
                  <AnimatePresence mode="wait">
                     {activeTab === 'orders' ? (
                        <motion.div
                           key="orders-tab"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="space-y-6"
                        >
                           <h2 className="font-display text-3xl font-bold text-foreground mb-8 tracking-tight uppercase">
                              Recent Orders
                           </h2>

                           {isLoadingOrders ? (
                              <div className="flex flex-col items-center justify-center py-20 gap-4">
                                 <Loader2 className="w-12 h-12 text-accent animate-spin" />
                                 <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em]">
                                    Retrieving your orders...
                                 </p>
                              </div>
                           ) : orders.length === 0 ? (
                              <div className="bg-surface/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-16 text-center">
                                 <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/40">
                                    <Package className="w-10 h-10" />
                                 </div>
                                 <h3 className="text-xl font-bold text-foreground mb-2">
                                    No orders yet
                                 </h3>
                                 <p className="text-muted-foreground mb-8">
                                    Ready to upgrade your tech? Your orders will
                                    appear here.
                                 </p>
                                 <button
                                    onClick={() => router.push('/')}
                                    className="bg-accent/10 text-accent border border-accent/20 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/20 transition-all shadow-sm"
                                 >
                                    Start Shopping
                                 </button>
                              </div>
                           ) : (
                              <div className="space-y-6">
                                 {orders.slice(0, 3).map((order) => {
                                 const status =
                                    statusConfig[
                                       order.status as keyof typeof statusConfig
                                    ];
                                 const StatusIcon = status.icon;

                                 return (
                                    <Link
                                       href={`/orders/${order.id}`}
                                       key={order.id}
                                       className="bg-surface/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group block"
                                    >
                                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                          <div className="flex items-center gap-6">
                                             <div
                                                className={`w-16 h-16 rounded-2xl ${status.bg} flex items-center justify-center ${status.color}`}
                                             >
                                                <StatusIcon
                                                   className={`w-8 h-8 ${order.status === 'processing' ? 'animate-spin' : ''}`}
                                                />
                                             </div>
                                             <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                                      Order #
                                                      {order.id
                                                         .slice(-8)
                                                         .toUpperCase()}
                                                   </p>
                                                   <div className="w-1 h-1 bg-border rounded-full" />
                                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                                      {new Date(
                                                         order.createdAt
                                                      ).toLocaleDateString()}
                                                   </p>
                                                </div>
                                                <h4 className="text-xl font-bold text-foreground">
                                                   $
                                                   {order.totalAmount.toLocaleString()}
                                                </h4>
                                             </div>
                                          </div>

                                          <div className="flex items-center gap-4 w-full md:w-auto">
                                             <div
                                                className={`flex-1 md:flex-none px-6 py-3 rounded-full ${status.bg} ${status.color} font-black text-[10px] uppercase tracking-[0.2em] text-center`}
                                             >
                                                {status.label}
                                             </div>
                                             <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                             </div>
                                          </div>
                                       </div>

                                       {/* Progress Bar Mini */}
                                       <div className="mt-8 relative pt-4">
                                          <div className="h-1 bg-muted/20 w-full rounded-full overflow-hidden">
                                             <div
                                                className={`h-full ${status.color.replace('text', 'bg')} transition-all duration-1000`}
                                                style={{
                                                   width:
                                                      order.status === 'pending'
                                                         ? '20%'
                                                         : order.status ===
                                                             'processing'
                                                           ? '40%'
                                                           : order.status ===
                                                               'shipped'
                                                             ? '70%'
                                                             : order.status ===
                                                                 'delivered'
                                                               ? '100%'
                                                               : '0%',
                                                }}
                                             />
                                          </div>
                                       </div>
                                    </Link>
                                 );
                              })}
                              {orders.length > 3 && (
                                 <div className="flex justify-center pt-4">
                                    <Link
                                       href="/orders"
                                       className="group flex items-center gap-3 bg-accent/10 text-accent border border-accent/20 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/20 transition-all active:scale-[0.98]"
                                     >
                                        View All Orders
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                     </Link>
                                  </div>
                               )}
                            </div>
                           )}
                        </motion.div>
                     ) : (
                        <motion.div
                           key="settings-tab"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="bg-surface/40 backdrop-blur-xl border border-border/50 rounded-[3rem] p-12 shadow-xl"
                        >
                           <div className="flex justify-between items-center mb-10">
                              <h2 className="font-display text-3xl font-bold text-foreground tracking-tight uppercase">
                                 Profile Settings
                              </h2>
                              <button
                                 onClick={() => setIsEditing(!isEditing)}
                                 className="text-accent font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
                              >
                                 {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                              </button>
                           </div>

                           <form
                              onSubmit={handleUpdateProfile}
                              className="space-y-8"
                           >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                                       Full Name
                                    </label>
                                    <input
                                       disabled={!isEditing}
                                       value={formData.name}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             name: e.target.value,
                                          })
                                       }
                                       className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 px-6 text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all disabled:opacity-50"
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                                       Phone Number
                                    </label>
                                    <input
                                       disabled={!isEditing}
                                       type="tel"
                                       value={formData.phone}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             phone: e.target.value,
                                          })
                                       }
                                       className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 px-6 text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all disabled:opacity-50"
                                       placeholder="+94 771 234 567"
                                    />
                                 </div>
                                 <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                                       Shipping Address
                                    </label>
                                    <input
                                       disabled={!isEditing}
                                       value={formData.address}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             address: e.target.value,
                                          })
                                       }
                                       className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 px-6 text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all disabled:opacity-50"
                                       placeholder="123 Street Name, Area"
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                                       City
                                    </label>
                                    <input
                                       disabled={!isEditing}
                                       value={formData.city}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             city: e.target.value,
                                          })
                                       }
                                       className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 px-6 text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all disabled:opacity-50"
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                                       Zip Code
                                    </label>
                                    <input
                                       disabled={!isEditing}
                                       value={formData.zipCode}
                                       onChange={(e) =>
                                          setFormData({
                                             ...formData,
                                             zipCode: e.target.value,
                                          })
                                       }
                                       className="w-full bg-background/50 border border-border/60 rounded-2xl py-4 px-6 text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all disabled:opacity-50"
                                    />
                                 </div>
                              </div>

                              <AnimatePresence>
                                 {isEditing && (
                                    <motion.div
                                       initial={{ opacity: 0, y: 10 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       exit={{ opacity: 0, y: 10 }}
                                       className="pt-6"
                                    >
                                       <button
                                          type="submit"
                                          className="w-full bg-accent text-white py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/90 transition-all shadow-glow active:scale-[0.98]"
                                       >
                                          Save Changes
                                       </button>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </form>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </main>
   );
}
