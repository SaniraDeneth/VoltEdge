'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
   Search,
   Eye,
   ShoppingBag,
   RotateCcw,
   Filter,
   X,
   Loader2,
   Calendar,
} from 'lucide-react';
import { orderApi } from '@/lib/api-client';
import type { Order } from '@/types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '@/components/ui/CustomSelect';

const STATUS_OPTIONS = [
   { id: 'pending', name: 'Pending' },
   { id: 'processing', name: 'Processing (Paid)' },
   { id: 'shipped', name: 'Shipped' },
   { id: 'delivered', name: 'Delivered' },
   { id: 'cancelled', name: 'Cancelled' },
];

export default function AdminOrdersPage() {
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedStatus, setSelectedStatus] = useState('');
   const [showFilters, setShowFilters] = useState(false);

   const fetchOrders = async () => {
      setLoading(true);
      try {
         const data = await orderApi.getAll({
            status: selectedStatus || undefined,
            search: searchTerm || undefined,
         });
         setOrders(data);
      } catch (error) {
         console.error('Error fetching orders:', error);
         toast.error('Failed to load orders');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         fetchOrders();
      }, 300);
      return () => clearTimeout(timeoutId);
   }, [searchTerm, selectedStatus]);

   const handleResetFilters = () => {
      setSearchTerm('');
      setSelectedStatus('');
   };

   const getStatusStyle = (status: string) => {
      switch (status) {
         case 'delivered':
            return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600';
         case 'shipped':
            return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
         case 'processing':
            return 'bg-amber-500/10 border-amber-500/20 text-amber-600';
         case 'pending':
            return 'bg-slate-500/10 border-slate-500/20 text-slate-600';
         case 'cancelled':
            return 'bg-rose-500/10 border-rose-500/20 text-rose-600';
         default:
            return 'bg-slate-100 border-slate-200 text-slate-600';
      }
   };

   return (
      <div className="space-y-8">
         {/* Header Section */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  Orders
               </h1>
               <p className="text-sm font-medium text-slate-500">
                  Track and manage customer payments and shipment fulfillment
               </p>
            </div>
         </div>

         {/* Search & Status Filters */}
         <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                     type="text"
                     placeholder="Search by Order ID, Customer Name or Email..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full rounded-2xl border border-slate-100 bg-white py-3.5 pl-12 pr-4 text-sm font-medium outline-none shadow-sm transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                  {searchTerm && (
                     <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                     >
                        <X className="h-4 w-4" />
                     </button>
                  )}
               </div>

               <div className="flex items-center gap-2">
                  <button
                     onClick={() => setShowFilters(!showFilters)}
                     className={`flex items-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-bold transition-all ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
                  >
                     <Filter className="h-4 w-4" />
                     {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                  {(selectedStatus || searchTerm) && (
                     <button
                        onClick={handleResetFilters}
                        className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-400 transition-all hover:bg-slate-50 hover:text-red-500"
                        title="Reset Filters"
                     >
                        <RotateCcw className="h-4 w-4" />
                     </button>
                  )}
               </div>
            </div>

            {/* Expanded Filters Panel */}
            <AnimatePresence>
               {showFilters && (
                  <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="relative z-30 overflow-visible"
                  >
                     <div className="grid grid-cols-1 gap-6 rounded-3xl bg-white border border-slate-100 p-8 sm:grid-cols-2 lg:grid-cols-3 shadow-sm">
                        <CustomSelect
                           label="Order Status"
                           placeholder="All Statuses"
                           options={STATUS_OPTIONS}
                           value={selectedStatus}
                           onChange={setSelectedStatus}
                        />
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Orders Table */}
         <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-50 bg-slate-50/50">
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                           Order Details
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                           Customer
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                           Date
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                           Total Price
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                           Status
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {loading && orders.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-20 text-center">
                              <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent" />
                              <p className="mt-4 text-sm font-bold text-slate-400">
                                 Loading orders...
                              </p>
                           </td>
                        </tr>
                     ) : orders.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-20 text-center">
                              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                 <ShoppingBag className="h-8 w-8 text-slate-300" />
                              </div>
                              <p className="mt-4 text-sm font-bold text-slate-400">
                                 No orders found
                              </p>
                           </td>
                        </tr>
                     ) : (
                        orders.map((order) => (
                           <tr
                              key={order.id}
                              className="group transition-colors hover:bg-slate-50/50"
                           >
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">
                                       Order #{order.id.slice(-6).toUpperCase()}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">
                                       {order.items.length}{' '}
                                       {order.items.length === 1
                                          ? 'item'
                                          : 'items'}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">
                                       {(
                                          order.userId as unknown as {
                                             name?: string;
                                             email?: string;
                                          }
                                       )?.name || 'Guest User'}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                       {(
                                          order.userId as unknown as {
                                             name?: string;
                                             email?: string;
                                          }
                                       )?.email || order.contactInfo?.email}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    {new Date(
                                       order.createdAt
                                    ).toLocaleDateString(undefined, {
                                       year: 'numeric',
                                       month: 'short',
                                       day: 'numeric',
                                    })}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-black text-slate-900">
                                 ${order.totalAmount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                 <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(order.status)}`}
                                 >
                                    {order.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <Link
                                       href={`/admin/orders/${order.id}`}
                                       className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 transition-all hover:border-accent hover:text-accent hover:shadow-sm"
                                       title="View Order Details"
                                    >
                                       <Eye className="h-4 w-4" />
                                    </Link>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
