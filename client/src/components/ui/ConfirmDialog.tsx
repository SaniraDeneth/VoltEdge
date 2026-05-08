'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, Info } from 'lucide-react';

interface ConfirmDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
   confirmText?: string;
   cancelText?: string;
   type?: 'danger' | 'info';
   isLoading?: boolean;
}

export default function ConfirmDialog({
   isOpen,
   onClose,
   onConfirm,
   title,
   message,
   confirmText = 'Confirm',
   cancelText = 'Cancel',
   type = 'danger',
   isLoading = false,
}: ConfirmDialogProps) {
   return (
      <AnimatePresence>
         {isOpen && (
            <div className="fixed inset-0 z-[9999] overflow-y-auto">
               {/* Backdrop */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={!isLoading ? onClose : undefined}
                  className="fixed h-screen inset-0 bg-slate-900/60 backdrop-blur-sm"
               />

               {/* Dialog Container */}
               <div className="flex min-h-screen items-center justify-center p-4">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 20 }}
                     transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 400,
                     }}
                     className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl border border-slate-100"
                  >
                     {/* Header with Icon */}
                     <div className="relative p-8 pb-0 flex flex-col items-center text-center">
                        {!isLoading && (
                           <button
                              type="button"
                              onClick={onClose}
                              className="absolute right-6 top-6 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                           >
                              <X className="h-5 w-5" />
                           </button>
                        )}

                        <div
                           className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
                              type === 'danger'
                                 ? 'bg-red-50 text-red-500'
                                 : 'bg-blue-50 text-blue-500'
                           }`}
                        >
                           {type === 'danger' ? (
                              <Trash2 className="h-8 w-8" />
                           ) : (
                              <Info className="h-8 w-8" />
                           )}
                        </div>

                        <h3 className="mb-2 text-2xl font-black tracking-tight text-slate-900">
                           {title}
                        </h3>
                        <p className="text-sm font-medium leading-relaxed text-slate-500 px-4">
                           {message}
                        </p>
                     </div>

                     {/* Actions */}
                     <div className="flex flex-col gap-3 p-8 pt-10">
                        <button
                           type="button"
                           onClick={onConfirm}
                           disabled={isLoading}
                           className={`flex h-14 w-full items-center justify-center gap-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 ${
                              type === 'danger'
                                 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600'
                                 : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800'
                           }`}
                        >
                           {isLoading && (
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                           )}
                           {confirmText}
                        </button>

                        <button
                           type="button"
                           onClick={onClose}
                           disabled={isLoading}
                           className="h-14 w-full rounded-2xl border border-slate-100 bg-white text-sm font-black text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50"
                        >
                           {cancelText}
                        </button>
                     </div>
                  </motion.div>
               </div>
            </div>
         )}
      </AnimatePresence>
   );
}
