'use client';

import React, { useState, useEffect } from 'react';
import {
   Search,
   Users as UsersIcon,
   ShieldAlert,
   UserCheck,
   Mail,
   Phone,
   MapPin,
   Loader2,
   Calendar,
} from 'lucide-react';
import { authApi } from '@/lib/api-client';
import type { User } from '@/types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsersPage() {
   const [users, setUsers] = useState<User[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>(
      'all'
   );

   useEffect(() => {
      fetchUsers();
   }, []);

   const fetchUsers = async () => {
      setIsLoading(true);
      try {
         const data = await authApi.getAll();
         setUsers(data);
      } catch (error: unknown) {
         const err = error as { message?: string };
         toast.error(err.message || 'Failed to load users');
      } finally {
         setIsLoading(false);
      }
   };

   // Filtering logic
   const filteredUsers = users.filter((user) => {
      const matchesSearch =
         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (user.phone && user.phone.includes(searchTerm));

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
   });

   // Stats calculation
   const totalUsers = users.length;
   const adminCount = users.filter((u) => u.role === 'admin').length;
   const customerCount = users.filter((u) => u.role === 'user').length;

   return (
      <div className="min-h-screen bg-[#fafbfc] px-6 py-8">
         {/* Header Section */}
         <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="font-display text-3xl font-black tracking-tight text-slate-900">
                  User <span className="text-accent italic">Management</span>
               </h1>
               <p className="mt-1 text-sm text-slate-500 font-medium">
                  Monitor and manage admin accounts, customer profiles, and
                  contact details.
               </p>
            </div>
         </div>

         {/* Summary Cards */}
         <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
            {/* Total Users */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm group hover:scale-[1.02] transition-transform duration-300">
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                     <UsersIcon className="h-6 w-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Total Users
                     </p>
                     <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                        {isLoading ? (
                           <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        ) : (
                           totalUsers
                        )}
                     </h3>
                  </div>
               </div>
            </div>

            {/* Administrators */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm group hover:scale-[1.02] transition-transform duration-300">
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                     <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Administrators
                     </p>
                     <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                        {isLoading ? (
                           <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        ) : (
                           adminCount
                        )}
                     </h3>
                  </div>
               </div>
            </div>

            {/* Regular Customers */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm group hover:scale-[1.02] transition-transform duration-300">
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                     <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Customers
                     </p>
                     <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                        {isLoading ? (
                           <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        ) : (
                           customerCount
                        )}
                     </h3>
                  </div>
               </div>
            </div>
         </div>

         {/* Filter and Search Bar */}
         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            {/* Search */}
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
               <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-accent focus:bg-white focus:outline-none transition-all"
               />
            </div>

            {/* Filters */}
            <div className="flex gap-2 shrink-0">
               {(['all', 'admin', 'user'] as const).map((role) => (
                  <button
                     key={role}
                     onClick={() => setRoleFilter(role)}
                     className={`rounded-2xl px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                        roleFilter === role
                           ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                           : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100 hover:text-slate-800'
                     }`}
                  >
                     {role === 'all'
                        ? 'All Roles'
                        : role === 'admin'
                          ? 'Admins'
                          : 'Customers'}
                  </button>
               ))}
            </div>
         </div>

         {/* Users Table */}
         <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            {isLoading ? (
               <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-accent" />
                  <p className="text-sm font-bold text-slate-500">
                     Loading users registry...
                  </p>
               </div>
            ) : filteredUsers.length === 0 ? (
               <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                     <UsersIcon className="h-8 w-8" />
                  </div>
                  <div>
                     <h3 className="text-lg font-black text-slate-900">
                        No users found
                     </h3>
                     <p className="text-sm text-slate-500 font-medium max-w-sm mt-1">
                        We couldn't find any users matching your filters or
                        search term. Try adjusting your query.
                     </p>
                  </div>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                     <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                           <th className="px-6 py-4">User</th>
                           <th className="px-6 py-4">Role</th>
                           <th className="px-6 py-4">Contact Info</th>
                           <th className="px-6 py-4">Registered Date</th>
                           <th className="px-6 py-4">Shipping Default</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        <AnimatePresence mode="popLayout">
                           {filteredUsers.map((user, index) => (
                              <motion.tr
                                 key={user.id || user.id}
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -10 }}
                                 transition={{
                                    duration: 0.2,
                                    delay: Math.min(index * 0.03, 0.3),
                                 }}
                                 className="hover:bg-slate-50/40 transition-colors"
                              >
                                 {/* User Identity */}
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                       <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-slate-100 shrink-0">
                                          <img
                                             src={
                                                user.avatar ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                   user.name
                                                )}&background=0D6EFD&color=fff`
                                             }
                                             alt={user.name}
                                             className="h-full w-full object-cover"
                                          />
                                       </div>
                                       <div>
                                          <h4 className="text-sm font-bold text-slate-900 hover:text-accent transition-colors">
                                             {user.name}
                                          </h4>
                                          <p className="text-xs text-slate-400 font-semibold">
                                             {user.email}
                                          </p>
                                       </div>
                                    </div>
                                 </td>

                                 {/* User Role Badge */}
                                 <td className="px-6 py-4">
                                    <span
                                       className={`inline-flex rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                                          user.role === 'admin'
                                             ? 'bg-purple-50 text-purple-600 border border-purple-100'
                                             : 'bg-blue-50 text-blue-600 border border-blue-100'
                                       }`}
                                    >
                                       {user.role}
                                    </span>
                                 </td>

                                 {/* Contact Info */}
                                 <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-xs text-slate-600 font-medium">
                                       {user.phone ? (
                                          <span className="flex items-center gap-1.5">
                                             <Phone className="h-3.5 w-3.5 text-slate-400" />
                                             {user.phone}
                                          </span>
                                       ) : (
                                          <span className="text-slate-400 italic">
                                             No phone linked
                                          </span>
                                       )}
                                       <span className="flex items-center gap-1.5 text-slate-400">
                                          <Mail className="h-3.5 w-3.5 text-slate-300" />
                                          {user.authProvider === 'google'
                                             ? 'Google Authenticated'
                                             : 'Credentials Linked'}
                                       </span>
                                    </div>
                                 </td>

                                 {/* Registration Date */}
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                       <Calendar className="h-4 w-4 text-slate-400" />
                                       {user.createdAt ? (
                                          new Date(
                                             user.createdAt
                                          ).toLocaleDateString(undefined, {
                                             year: 'numeric',
                                             month: 'short',
                                             day: 'numeric',
                                          })
                                       ) : (
                                          <span className="text-slate-400 italic">
                                             Pre-migration
                                          </span>
                                       )}
                                    </div>
                                 </td>

                                 {/* Shipping Default */}
                                 <td className="px-6 py-4">
                                    {user.shippingAddress?.address ? (
                                       <div className="flex items-start gap-2 max-w-[200px]">
                                          <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                          <div className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                                             <p className="truncate text-slate-800">
                                                {user.shippingAddress.address}
                                             </p>
                                             <p className="text-slate-400">
                                                {user.shippingAddress.city},{' '}
                                                {user.shippingAddress.zipCode}
                                             </p>
                                          </div>
                                       </div>
                                    ) : (
                                       <span className="text-xs text-slate-400 italic font-medium">
                                          No default address
                                       </span>
                                    )}
                                 </td>
                              </motion.tr>
                           ))}
                        </AnimatePresence>
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </div>
   );
}
