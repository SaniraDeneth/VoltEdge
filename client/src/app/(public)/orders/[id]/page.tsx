'use client';

import React, { useState, useEffect } from 'react';

import { ordersApi, paymentApi } from '@/lib/api-client';
import { Order, Product } from '@/types';
import {
   Package,
   Clock,
   CheckCircle2,
   Truck,
   XCircle,
   Loader2,
   MapPin,
   Phone,
   CreditCard,
   ShoppingBag,
   ChevronLeft,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const statusConfig = {
   pending: {
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      label: 'Order Pending',
      desc: 'Your order has been received and is waiting for payment confirmation.',
   },
   processing: {
      icon: Loader2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      label: 'Processing',
      desc: 'We are currently preparing your premium hardware for shipment.',
   },
   shipped: {
      icon: Truck,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      label: 'In Transit',
      desc: 'Your order is on the move and will reach you soon.',
   },
   delivered: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      label: 'Delivered',
      desc: 'The elite tech has arrived at your destination.',
   },
   cancelled: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      label: 'Cancelled',
      desc: 'This order has been cancelled and refunded.',
   },
};

export default function OrderDetailsPage() {
   const { id } = useParams();
   const router = useRouter();
   const [order, setOrder] = useState<Order | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchOrder = async () => {
         try {
            const data = await ordersApi.getById(id as string);
            setOrder(data);
         } catch (error) {
            console.error('Failed to fetch order', error);
         } finally {
            setIsLoading(false);
         }
      };

      if (id) fetchOrder();
   }, [id]);

   if (isLoading) {
      return (
         <main className="min-h-screen bg-gradient-hero flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
         </main>
      );
   }

   if (!order) {
      return (
         <main className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center pt-32 pb-20 px-6">
            <XCircle className="w-20 h-20 text-red-500/20 mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4 tracking-tight uppercase">
               Order Not Found
            </h1>
            <button
               onClick={() => router.push('/orders')}
               className="bg-accent/10 text-accent border border-accent/20 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/20 transition-all shadow-sm"
            >
               Back to Orders
            </button>
         </main>
      );
   }

   const status = statusConfig[order.status as keyof typeof statusConfig];
   const StatusIcon = status.icon;

   return (
      <main className="min-h-screen bg-gradient-hero pt-32 pb-20 px-6">
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
               <button
                  onClick={() => router.push('/orders')}
                  className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all font-black text-[10px] uppercase tracking-[0.2em]"
               >
                  <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Order #{order.id.slice(-8).toUpperCase()}
               </button>
               <div
                  className={`px-6 py-3 rounded-full ${status.bg} ${status.color} font-black text-[10px] uppercase tracking-[0.2em] border border-current/10`}
               >
                  {status.label}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Main Column */}
               <div className="lg:col-span-8 space-y-10">
                  {/* Status Banner */}
                  <div className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 overflow-hidden relative">
                     <div
                        className={`absolute top-0 left-0 w-1.5 h-full ${status.color.replace('text', 'bg')}`}
                     />
                     <div className="flex items-start gap-8 relative z-10">
                        <div
                           className={`w-16 h-16 rounded-2xl ${status.bg} flex items-center justify-center ${status.color}`}
                        >
                           <StatusIcon
                              className={`w-8 h-8 ${order.status === 'processing' ? 'animate-spin' : ''}`}
                           />
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold text-foreground mb-2">
                              {status.label}
                           </h2>
                           <p className="text-muted-foreground font-medium leading-relaxed max-w-md">
                              {status.desc}
                           </p>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mt-4">
                              Registered:{' '}
                              {new Date(order.createdAt).toLocaleString()}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-foreground/5 rounded-xl">
                           <ShoppingBag className="w-6 h-6 text-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground tracking-tight uppercase">
                           Package Contents
                        </h3>
                     </div>

                     <div className="divide-y divide-border/40">
                        {order.items.map((item) => {
                           const product =
                              typeof item.productId === 'object'
                                 ? item.productId
                                 : null;
                           const productId =
                              typeof item.productId === 'string'
                                 ? item.productId
                                 : item.productId.id;

                           return (
                              <div
                                 key={productId}
                                 className="py-8 first:pt-0 last:pb-0 flex items-center gap-8 group"
                              >
                                 <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border border-border/40 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                                    <Image
                                       src={
                                          product?.images?.[0] ||
                                          'https://placehold.co/100x100?text=VoltEdge'
                                       }
                                       alt="Product"
                                       fill
                                       className="object-cover"
                                    />
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                                       {product?.name ||
                                          'VoltEdge Premium Item'}
                                    </h4>
                                    <div className="flex items-center gap-4 text-sm">
                                       <p className="text-muted-foreground font-medium">
                                          Quantity:{' '}
                                          <span className="text-foreground font-bold">
                                             {item.quantity}
                                          </span>
                                       </p>
                                       <div className="w-1 h-1 bg-border rounded-full" />
                                       <p className="text-muted-foreground font-medium">
                                          Price:{' '}
                                          <span className="text-foreground font-bold">
                                             ${item.price.toLocaleString()}
                                          </span>
                                       </p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xl font-bold text-foreground">
                                       $
                                       {(
                                          item.price * item.quantity
                                       ).toLocaleString()}
                                    </p>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>

               {/* Sidebar */}
               <div className="lg:col-span-4 space-y-10">
                  {/* Shipping Info */}
                  <div className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10">
                     <h3 className="text-xl font-bold text-foreground mb-8 tracking-tight uppercase flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-accent" />
                        Shipping To
                     </h3>
                     <div className="space-y-6">
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-0.5">
                                 Recipient
                              </p>
                              <p className="text-foreground font-bold text-sm">
                                 {order.contactInfo.firstName}{' '}
                                 {order.contactInfo.lastName}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-0.5">
                                 Destination
                              </p>
                              <p className="text-foreground font-bold text-sm leading-relaxed">
                                 {order.shippingAddress.address}
                                 <br />
                                 {order.shippingAddress.city},{' '}
                                 {order.shippingAddress.zipCode}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-0.5">
                                 Contact
                              </p>
                              <p className="text-foreground font-bold text-sm">
                                 {order.contactInfo.phone}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-accent blur-[80px] -mr-16 -mt-16 opacity-10" />
                     <h3 className="text-xl font-bold text-foreground mb-8 tracking-tight uppercase flex items-center gap-3 relative z-10">
                        <CreditCard className="w-5 h-5 text-accent" />
                        Summary
                     </h3>
                     <div className="space-y-4 relative z-10">
                        <div className="flex justify-between text-muted-foreground text-sm font-medium">
                           <span>Subtotal</span>
                           <span className="text-foreground font-bold">
                              ${order.totalAmount.toLocaleString()}
                           </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground text-sm font-medium">
                           <span>Shipping</span>
                           <span className="text-accent font-black text-[10px] uppercase tracking-widest">
                              Free Delivery
                           </span>
                        </div>
                        <div className="h-px bg-border/40 my-6" />
                        <div className="flex justify-between items-center">
                           <span className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                              Total Paid
                           </span>
                           <span className="text-3xl font-black text-foreground">
                              ${order.totalAmount.toLocaleString()}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Actions Section */}
                  <div className="p-10 bg-accent/5 rounded-[2.5rem] border border-accent/10 space-y-4">
                     {order.status === 'pending' && (
                        <>
                           <button
                              onClick={async () => {
                                 try {
                                    const { url } =
                                       await paymentApi.createCheckoutSession(
                                          order.items.map((item) => ({
                                             productId:
                                                typeof item.productId ===
                                                'string'
                                                   ? item.productId
                                                   : (item.productId as Product)
                                                        .id,
                                             quantity: item.quantity,
                                          })),
                                          order.id
                                       );
                                    window.location.href = url;
                                 } catch (error) {
                                    console.error(
                                       'Failed to initiate payment',
                                       error
                                    );
                                 }
                              }}
                              className="w-full py-5 bg-accent text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/90 transition-all shadow-glow active:scale-[0.98]"
                           >
                              Pay Now
                           </button>
                           <button
                              onClick={async () => {
                                 try {
                                    const updated = await ordersApi.cancel(
                                       order.id
                                    );
                                    setOrder(updated);
                                 } catch (error) {
                                    console.error(
                                       'Failed to cancel order',
                                       error
                                    );
                                 }
                              }}
                              className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all"
                           >
                              Cancel Order
                           </button>
                        </>
                     )}
                     <p className="text-sm font-medium text-foreground pt-4 text-center">
                        Having issues with your order?
                     </p>
                     <button className="w-full py-4 border border-accent/20 rounded-full text-accent font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/10 transition-all">
                        Contact Support
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
}
