'use client';

import React, { useState, useEffect } from 'react';
import { orderApi } from '@/lib/api-client';
import { Order } from '@/types';
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
   Settings,
   Mail,
   User,
   Printer,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import CustomSelect from '@/components/ui/CustomSelect';

const statusConfig = {
   pending: {
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      label: 'Order Pending',
      desc: 'The order has been received and is waiting for payment confirmation.',
   },
   processing: {
      icon: Loader2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      label: 'Processing',
      desc: 'The order payment is successful. The premium hardware is being prepared for shipment.',
   },
   shipped: {
      icon: Truck,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      label: 'In Transit',
      desc: 'The package has been handed over to the courier and is on its way.',
   },
   delivered: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      label: 'Delivered',
      desc: 'The premium tech has been successfully delivered to the destination.',
   },
   cancelled: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      label: 'Cancelled',
      desc: 'This order has been cancelled and its inventory stock restored.',
   },
};

const STATUS_OPTIONS = [
   { id: 'shipped', name: 'Shipped' },
   { id: 'delivered', name: 'Delivered' },
   { id: 'cancelled', name: 'Cancelled' },
];

export default function AdminOrderDetailsPage() {
   const { id } = useParams();
   const router = useRouter();
   const [order, setOrder] = useState<Order | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isUpdating, setIsUpdating] = useState(false);

   const fetchOrder = async () => {
      try {
         const data = await orderApi.getById(id as string);
         setOrder(data);
      } catch (error) {
         console.error('Failed to fetch order', error);
         toast.error('Failed to load order details');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (id) fetchOrder();
   }, [id]);

   const handleStatusChange = async (newStatus: string) => {
      if (!id || !order) return;
      setIsUpdating(true);
      try {
         await orderApi.updateStatus(id as string, newStatus);
         toast.success(`Order status updated to ${newStatus}`);
         fetchOrder();
      } catch (error: unknown) {
         const err = error as { message?: string };
         toast.error(err.message || 'Failed to update order status');
      } finally {
         setIsUpdating(false);
      }
   };

   if (isLoading) {
      return (
         <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
         </div>
      );
   }

   if (!order) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <XCircle className="w-20 h-20 text-red-500/20 mb-6" />
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">
               Order Not Found
            </h1>
            <button
               onClick={() => router.push('/admin/orders')}
               className="bg-accent px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
            >
               Back to Orders
            </button>
         </div>
      );
   }

   const status =
      statusConfig[order.status as keyof typeof statusConfig] ||
      statusConfig.pending;
   const StatusIcon = status.icon;

   return (
      <div className="space-y-8 pb-10">
         {/* Printable Invoice (Only visible when printing) */}
         <div className="hidden print:block print:p-8 print:text-black print:bg-white print:w-full print:max-w-none print:m-0">
            {/* Global Print Style overrides to clean up external storefront layout elements */}
            <style
               dangerouslySetInnerHTML={{
                  __html: `
          @page {
            size: auto;
            margin: 0mm;
          }
          @media print {
            header, footer, nav, aside, button, .print\\:hidden, #header, #footer, #sidebar, [role="navigation"] {
              display: none !important;
            }
            body {
              background: white !important;
              color: black !important;
              padding: 20mm !important;
            }
          }
        `,
               }}
            />

            <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
               <h1 className="text-3xl font-black tracking-tight uppercase mb-1">
                  VoltEdge
               </h1>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Premium Tech Instruments
               </p>
               <p className="text-xs text-slate-400 mt-2">
                  support@voltedge.com | www.voltedge.com
               </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
               <div>
                  <h3 className="font-bold uppercase text-xs tracking-wider text-slate-400 mb-2">
                     Billing & Shipping Details
                  </h3>
                  <p className="font-bold text-slate-900">
                     {(
                        order.userId as unknown as {
                           name?: string;
                           email?: string;
                        }
                     )?.name ||
                        `${order.contactInfo?.firstName} ${order.contactInfo?.lastName}`}
                  </p>
                  <p className="text-slate-600 mt-1">
                     {order.contactInfo?.phone}
                  </p>
                  <p className="text-slate-600">{order.contactInfo?.email}</p>
                  <p className="text-slate-600 mt-2 leading-relaxed">
                     {order.shippingAddress.address}
                     <br />
                     {order.shippingAddress.city},{' '}
                     {order.shippingAddress.zipCode}
                  </p>
               </div>
               <div className="text-right">
                  <h3 className="font-bold uppercase text-xs tracking-wider text-slate-400 mb-2">
                     Invoice Information
                  </h3>
                  <p className="font-bold text-slate-900">
                     Invoice ID: #{order.id.toUpperCase()}
                  </p>
                  <p className="text-slate-600 mt-1">
                     Order Date:{' '}
                     {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-slate-600">
                     Payment Status: Paid (Stripe)
                  </p>
                  <p className="text-slate-900 font-bold uppercase text-xs mt-2">
                     Status: {order.status}
                  </p>
               </div>
            </div>

            {/* Invoice Table */}
            <table className="w-full text-left border-collapse mb-8 text-sm">
               <thead>
                  <tr className="border-b-2 border-slate-900">
                     <th className="py-3 font-bold uppercase text-xs text-slate-500">
                        Item Description
                     </th>
                     <th className="py-3 font-bold uppercase text-xs text-slate-500 text-center w-20">
                        Quantity
                     </th>
                     <th className="py-3 font-bold uppercase text-xs text-slate-500 text-right w-32">
                        Unit Price
                     </th>
                     <th className="py-3 font-bold uppercase text-xs text-slate-500 text-right w-32">
                        Total Price
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                  {order.items.map((item, index) => {
                     const product =
                        item.productId && typeof item.productId === 'object'
                           ? item.productId
                           : null;
                     const productId =
                        typeof item.productId === 'string'
                           ? item.productId
                           : item.productId
                             ? (
                                  item.productId as unknown as {
                                     id?: string;
                                     _id?: string;
                                  }
                               ).id ||
                               (
                                  item.productId as unknown as {
                                     id?: string;
                                     _id?: string;
                                  }
                               )._id
                             : `deleted-item-${index}`;

                     return (
                        <tr key={productId} className="py-3">
                           <td className="py-4 font-bold text-slate-900">
                              {product?.name || 'VoltEdge Premium Item'}
                           </td>
                           <td className="py-4 text-center font-medium text-slate-600">
                              {item.quantity}
                           </td>
                           <td className="py-4 text-right font-medium text-slate-600">
                              ${item.price.toLocaleString()}
                           </td>
                           <td className="py-4 text-right font-bold text-slate-900">
                              ${(item.price * item.quantity).toLocaleString()}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>

            {/* Invoice Summary */}
            <div className="flex justify-end text-sm">
               <div className="w-64 space-y-3">
                  <div className="flex justify-between items-center text-slate-500">
                     <span>Subtotal</span>
                     <span className="font-bold text-slate-900">
                        ${order.totalAmount.toLocaleString()}
                     </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                     <span>Shipping</span>
                     <span className="font-bold text-slate-900">FREE</span>
                  </div>
                  <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-base font-bold">
                     <span>Grand Total</span>
                     <span className="text-lg font-black text-slate-900">
                        ${order.totalAmount.toLocaleString()}
                     </span>
                  </div>
               </div>
            </div>

            <div className="text-center border-t border-slate-200 pt-8 mt-16 text-xs text-slate-500">
               <p className="font-bold text-sm">Thank you for your business!</p>
            </div>
         </div>

         {/* Screen Layout (Hidden during print) */}
         <div className="space-y-8 print:hidden">
            {/* Header / Back Link */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <button
                     onClick={() => router.push('/admin/orders')}
                     className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors mb-2"
                  >
                     <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                     Back to All Orders
                  </button>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                     Order #{order.id.slice(-8).toUpperCase()}
                  </h1>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                     Registered on {new Date(order.createdAt).toLocaleString()}
                  </p>
               </div>

               <div className="flex items-center gap-3">
                  <button
                     onClick={() => window.print()}
                     className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95 cursor-pointer"
                     title="Print Classic Bill"
                  >
                     <Printer className="h-4 w-4" />
                     Print Bill
                  </button>
                  <span
                     className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest ${status.bg} ${status.color} ${status.border}`}
                  >
                     {order.status}
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Main Column */}
               <div className="lg:col-span-8 space-y-8">
                  {/* Status Details Banner */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 relative shadow-sm overflow-hidden">
                     <div
                        className={`absolute top-0 left-0 w-1.5 h-full ${status.color.replace('text', 'bg')}`}
                     />
                     <div className="flex items-start gap-6 relative z-10">
                        <div
                           className={`w-14 h-14 rounded-2xl ${status.bg} flex items-center justify-center ${status.color}`}
                        >
                           <StatusIcon
                              className={`w-7 h-7 ${order.status === 'processing' || isUpdating ? 'animate-spin' : ''}`}
                           />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-slate-900 mb-1">
                              {status.label}
                           </h2>
                           <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md">
                              {status.desc}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Package Contents */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                     <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight uppercase flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-slate-600" />
                        Package Contents
                     </h3>

                     <div className="divide-y divide-slate-100">
                        {order.items.map((item, index) => {
                           const product =
                              item.productId &&
                              typeof item.productId === 'object'
                                 ? item.productId
                                 : null;
                           const productId =
                              typeof item.productId === 'string'
                                 ? item.productId
                                 : item.productId
                                   ? (
                                        item.productId as unknown as {
                                           id?: string;
                                           _id?: string;
                                        }
                                     ).id ||
                                     (
                                        item.productId as unknown as {
                                           id?: string;
                                           _id?: string;
                                        }
                                     )._id
                                   : `deleted-item-${index}`;

                           return (
                              <div
                                 key={productId}
                                 className="py-6 first:pt-0 last:pb-0 flex items-center gap-6 group"
                              >
                                 <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 shadow-sm">
                                    <img
                                       src={
                                          product?.images?.[0] ||
                                          'https://placehold.co/100x100?text=VoltEdge'
                                       }
                                       alt="Product"
                                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                 </div>

                                 <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-accent transition-colors">
                                       {product?.name ||
                                          'VoltEdge Premium Item'}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                                       <p>
                                          Quantity:{' '}
                                          <span className="text-slate-900 font-bold">
                                             {item.quantity}
                                          </span>
                                       </p>
                                       <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                       <p>
                                          Unit Price:{' '}
                                          <span className="text-slate-900 font-bold">
                                             ${item.price.toLocaleString()}
                                          </span>
                                       </p>
                                    </div>
                                 </div>

                                 <div className="text-right">
                                    <p className="text-base font-black text-slate-900">
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
               <div className="lg:col-span-4 space-y-8">
                  {/* Status Management */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                     <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight uppercase flex items-center gap-3">
                        <Settings className="w-5 h-5 text-accent" />
                        Manage Status
                     </h3>

                     <div className="space-y-4">
                        <CustomSelect
                           label="Update Status"
                           placeholder="Change order status..."
                           options={STATUS_OPTIONS}
                           value={order.status}
                           onChange={handleStatusChange}
                        />

                        {isUpdating && (
                           <div className="flex items-center justify-center gap-2 text-xs font-bold text-accent py-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving status changes...
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Customer / Shipping Address Details */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                     <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight uppercase flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-accent" />
                        Customer Details
                     </h3>

                     <div className="space-y-6">
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                              <User className="w-4 h-4 text-slate-400" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                 Name
                              </p>
                              <p className="text-sm font-bold text-slate-900">
                                 {(
                                    order.userId as unknown as {
                                       name?: string;
                                       email?: string;
                                    }
                                 )?.name ||
                                    `${order.contactInfo?.firstName} ${order.contactInfo?.lastName}`}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                              <Mail className="w-4 h-4 text-slate-400" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                 Email
                              </p>
                              <p className="text-sm font-bold text-slate-900 truncate">
                                 {(
                                    order.userId as unknown as {
                                       name?: string;
                                       email?: string;
                                    }
                                 )?.email || order.contactInfo?.email}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                              <Phone className="w-4 h-4 text-slate-400" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                 Phone
                              </p>
                              <p className="text-sm font-bold text-slate-900">
                                 {order.contactInfo?.phone}
                              </p>
                           </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                              <Package className="w-4 h-4 text-slate-400" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                 Address
                              </p>
                              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                                 {order.shippingAddress.address}
                                 <br />
                                 {order.shippingAddress.city},{' '}
                                 {order.shippingAddress.zipCode}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                     <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight uppercase flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-accent" />
                        Order Total
                     </h3>

                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium">
                           <span className="text-slate-500">Subtotal</span>
                           <span className="text-slate-900 font-bold">
                              ${order.totalAmount.toLocaleString()}
                           </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium">
                           <span className="text-slate-500">Shipping</span>
                           <span className="text-emerald-600 font-bold">
                              FREE
                           </span>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                           <span className="text-base font-bold text-slate-900">
                              Total
                           </span>
                           <span className="text-2xl font-black text-slate-900">
                              ${order.totalAmount.toLocaleString()}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
