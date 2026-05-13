'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
   ArrowLeft,
   Trash2,
   Plus,
   FolderPlus,
   Award,
   UploadCloud,
   Loader2,
   X,
   BookOpen,
   Edit2,
   Check,
} from 'lucide-react';
import { categoryApi, brandApi } from '@/lib/api-client';
import type { Category, Brand } from '@/types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Image from 'next/image';

export default function AdminMetadataPage() {
   const router = useRouter();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const editBrandFileInputRef = useRef<HTMLInputElement>(null);

   const [categories, setCategories] = useState<Category[]>([]);
   const [brands, setBrands] = useState<Brand[]>([]);
   const [loadingCats, setLoadingCats] = useState(true);
   const [loadingBrands, setLoadingBrands] = useState(true);

   // Creation form states
   const [catName, setCatName] = useState('');
   const [isCreatingCat, setIsCreatingCat] = useState(false);

   const [brandName, setBrandName] = useState('');
   const [brandFile, setBrandFile] = useState<File | null>(null);
   const [brandPreview, setBrandPreview] = useState<string>('');
   const [isCreatingBrand, setIsCreatingBrand] = useState(false);

   // Edit states
   const [editingCatId, setEditingCatId] = useState<string | null>(null);
   const [editingCatName, setEditingCatName] = useState('');
   const [isSavingCat, setIsSavingCat] = useState(false);

   const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
   const [editingBrandName, setEditingBrandName] = useState('');
   const [editingBrandFile, setEditingBrandFile] = useState<File | null>(null);
   const [editingBrandPreview, setEditingBrandPreview] = useState<string>('');
   const [isSavingBrand, setIsSavingBrand] = useState(false);

   // Deletion confirmation states
   const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'category' | 'brand'; name: string } | null>(null);
   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const fetchCategories = async () => {
      setLoadingCats(true);
      try {
         const data = await categoryApi.getAll();
         setCategories(data);
      } catch (error) {
         console.error('Error fetching categories:', error);
         toast.error('Failed to load categories');
      } finally {
         setLoadingCats(false);
      }
   };

   const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
         const data = await brandApi.getAll();
         setBrands(data);
      } catch (error) {
         console.error('Error fetching brands:', error);
         toast.error('Failed to load brands');
      } finally {
         setLoadingBrands(false);
      }
   };

   useEffect(() => {
      fetchCategories();
      fetchBrands();
   }, []);

   const handleCreateCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!catName.trim()) return;

      setIsCreatingCat(true);
      try {
         await categoryApi.create({
            name: catName,
         });
         toast.success('Category created successfully');
         setCatName('');
         fetchCategories();
      } catch (error: unknown) {
         const err = error as { message?: string };
         toast.error(err.message || 'Failed to create category');
      } finally {
         setIsCreatingCat(false);
      }
   };

   const handleStartEditCat = (cat: Category) => {
      setEditingCatId(cat.id);
      setEditingCatName(cat.name);
   };

   const handleCancelEditCat = () => {
      setEditingCatId(null);
      setEditingCatName('');
   };

   const handleUpdateCategory = async (id: string) => {
      if (!editingCatName.trim()) return;
      setIsSavingCat(true);
      try {
         await categoryApi.update(id, { name: editingCatName });
         toast.success('Category updated successfully');
         setEditingCatId(null);
         fetchCategories();
      } catch (error: unknown) {
         const err = error as { message?: string };
         toast.error(err.message || 'Failed to update category');
      } finally {
         setIsSavingCat(false);
      }
   };

   const handleStartEditBrand = (brand: Brand) => {
      setEditingBrandId(brand.id);
      setEditingBrandName(brand.name);
      setEditingBrandFile(null);
      setEditingBrandPreview(brand.image || '');
   };

   const handleCancelEditBrand = () => {
      if (editingBrandPreview && !brands.find(b => b.id === editingBrandId)?.image?.includes(editingBrandPreview)) {
         URL.revokeObjectURL(editingBrandPreview);
      }
      setEditingBrandId(null);
      setEditingBrandName('');
      setEditingBrandFile(null);
      setEditingBrandPreview('');
   };

   const handleEditBrandFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      setEditingBrandFile(file);
      setEditingBrandPreview(URL.createObjectURL(file));
   };

   const handleUpdateBrand = async (id: string) => {
      if (!editingBrandName.trim()) return;
      setIsSavingBrand(true);
      try {
         const formData = new FormData();
         formData.append('name', editingBrandName);
         if (editingBrandFile) {
            formData.append('image', editingBrandFile);
         }

         await brandApi.update(id, formData);
         toast.success('Brand updated successfully');
         setEditingBrandId(null);
         setEditingBrandFile(null);
         setEditingBrandPreview('');
         fetchBrands();
      } catch (error: unknown) {
         const err = error as { message?: string };
         toast.error(err.message || 'Failed to update brand');
      } finally {
         setIsSavingBrand(false);
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      setBrandFile(file);
      setBrandPreview(URL.createObjectURL(file));
   };

   const handleRemoveBrandFile = () => {
      setBrandFile(null);
      if (brandPreview) {
         URL.revokeObjectURL(brandPreview);
         setBrandPreview('');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
   };

   const handleCreateBrand = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!brandName.trim()) return;

      setIsCreatingBrand(true);
      try {
         const formData = new FormData();
         formData.append('name', brandName);
         if (brandFile) {
            formData.append('image', brandFile);
         }

         await brandApi.create(formData);
         toast.success('Brand created successfully');
         setBrandName('');
         handleRemoveBrandFile();
         fetchBrands();
      } catch (error: unknown) {
         const err = error as { message?: string };
         toast.error(err.message || 'Failed to create brand');
      } finally {
         setIsCreatingBrand(false);
      }
   };

   const handleDeleteClick = (id: string, type: 'category' | 'brand', name: string) => {
      setDeleteTarget({ id, type, name });
      setIsConfirmOpen(true);
   };

   const handleConfirmDelete = async () => {
      if (!deleteTarget) return;

      setIsDeleting(true);
      try {
         if (deleteTarget.type === 'category') {
            await categoryApi.delete(deleteTarget.id);
            toast.success(`Category "${deleteTarget.name}" deleted successfully`);
            fetchCategories();
         } else {
            await brandApi.delete(deleteTarget.id);
            toast.success(`Brand "${deleteTarget.name}" deleted successfully`);
            fetchBrands();
         }
         setIsConfirmOpen(false);
         setDeleteTarget(null);
      } catch (error: unknown) {
         const err = error as { message?: string };
         toast.error(err.message || `Failed to delete ${deleteTarget.type}`);
      } finally {
         setIsDeleting(false);
      }
   };

   return (
      <div className="space-y-8">
         {/* Header Section */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <Link
                  href="/admin/products"
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-2 text-xs font-bold uppercase tracking-widest"
               >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Products
               </Link>
               <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  Categories & <span className="text-accent italic">Brands</span>
               </h1>
               <p className="text-sm font-medium text-slate-500">
                  Organize and structure your precison catalog classifiers
               </p>
            </div>
         </div>

         {/* Grid Columns */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT COLUMN: CATEGORIES */}
            <div className="space-y-8">
               {/* Create Category Card */}
               <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <FolderPlus className="h-5 w-5" />
                     </div>
                     <h2 className="text-lg font-bold text-slate-900">
                        Create Category
                     </h2>
                  </div>

                  <form onSubmit={handleCreateCategory} className="space-y-5">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                           Category Name
                        </label>
                        <input
                           type="text"
                           required
                           placeholder="e.g. Oscilloscopes"
                           value={catName}
                           onChange={(e) => setCatName(e.target.value)}
                           className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                        />
                     </div>

                     <button
                        type="submit"
                        disabled={isCreatingCat || !catName.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50"
                     >
                        {isCreatingCat ? (
                           <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                           <Plus className="h-5 w-5" />
                        )}
                        Create Category
                     </button>
                  </form>
               </div>

               {/* Categories list card */}
               <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                  <h3 className="text-md font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <BookOpen className="h-5 w-5 text-slate-400" />
                     Existing Categories
                  </h3>

                  {loadingCats ? (
                     <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                     </div>
                  ) : categories.length === 0 ? (
                     <p className="text-center py-10 text-sm font-medium text-slate-400">
                        No categories found. Create one above to get started.
                     </p>
                  ) : (
                     <div className="divide-y divide-slate-100 animate-fadeIn">
                        {categories.map((cat) => (
                           <div key={cat.id} className="flex items-center justify-between py-4 group min-h-[64px]">
                              {editingCatId === cat.id ? (
                                 <div className="flex items-center gap-2 w-full">
                                    <input
                                       type="text"
                                       value={editingCatName}
                                       onChange={(e) => setEditingCatName(e.target.value)}
                                       className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition-all focus:border-accent focus:bg-white"
                                       placeholder="Category name"
                                       autoFocus
                                    />
                                    <button
                                       onClick={() => handleUpdateCategory(cat.id)}
                                       disabled={isSavingCat || !editingCatName.trim()}
                                       className="rounded-xl p-2 bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white disabled:opacity-50"
                                       title="Save"
                                    >
                                       {isSavingCat ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                       ) : (
                                          <Check className="h-4 w-4" />
                                       )}
                                    </button>
                                    <button
                                       onClick={handleCancelEditCat}
                                       className="rounded-xl p-2 bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                                       title="Cancel"
                                    >
                                       <X className="h-4 w-4" />
                                    </button>
                                 </div>
                              ) : (
                                 <>
                                    <div className="min-w-0 pr-4">
                                       <h4 className="text-sm font-bold text-slate-900 truncate">
                                          {cat.name}
                                       </h4>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                                       <button
                                          onClick={() => handleStartEditCat(cat)}
                                          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-accent"
                                          title="Edit Category"
                                       >
                                          <Edit2 className="h-4 w-4" />
                                       </button>
                                       <button
                                          onClick={() => handleDeleteClick(cat.id, 'category', cat.name)}
                                          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                          title="Delete Category"
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </button>
                                    </div>
                                 </>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* RIGHT COLUMN: BRANDS */}
            <div className="space-y-8">
               {/* Create Brand Card */}
               <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <Award className="h-5 w-5" />
                     </div>
                     <h2 className="text-lg font-bold text-slate-900">
                        Create Brand
                     </h2>
                  </div>

                  <form onSubmit={handleCreateBrand} className="space-y-5">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                           Brand Name
                        </label>
                        <input
                           type="text"
                           required
                           placeholder="e.g. Keysight Technologies"
                           value={brandName}
                           onChange={(e) => setBrandName(e.target.value)}
                           className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                        />
                     </div>

                     {/* Image Upload box */}
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                           Brand Logo / Image
                        </label>

                        {!brandPreview ? (
                           <div
                              onClick={() => fileInputRef.current?.click()}
                              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center cursor-pointer transition-all hover:bg-slate-50 hover:border-accent/40"
                           >
                              <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                              <p className="text-xs font-bold text-slate-500">
                                 Click to upload logo
                              </p>
                              <p className="text-[10px] font-medium text-slate-400 mt-1">
                                 Support JPG, PNG, WEBP
                              </p>
                              <input
                                 type="file"
                                 ref={fileInputRef}
                                 accept="image/*"
                                 onChange={handleFileChange}
                                 className="hidden"
                              />
                           </div>
                        ) : (
                           <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white border border-slate-200">
                                    <Image
                                       src={brandPreview}
                                       alt="Preview"
                                       fill
                                       className="object-contain p-1"
                                    />
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                                       {brandFile?.name}
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-400">
                                       {brandFile ? `${(brandFile.size / 1024).toFixed(1)} KB` : ''}
                                    </p>
                                 </div>
                              </div>
                              <button
                                 type="button"
                                 onClick={handleRemoveBrandFile}
                                 className="rounded-xl p-1.5 bg-slate-100 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
                              >
                                 <X className="h-4 w-4" />
                              </button>
                           </div>
                        )}
                     </div>

                     <button
                        type="submit"
                        disabled={isCreatingBrand || !brandName.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50"
                     >
                        {isCreatingBrand ? (
                           <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                           <Plus className="h-5 w-5" />
                        )}
                        Create Brand
                     </button>
                  </form>
               </div>

               {/* Brands List Card */}
               <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                  <h3 className="text-md font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <Award className="h-5 w-5 text-slate-400" />
                     Existing Brands
                  </h3>

                  {loadingBrands ? (
                     <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                     </div>
                  ) : brands.length === 0 ? (
                     <p className="text-center py-10 text-sm font-medium text-slate-400">
                        No brands found. Create one above to get started.
                     </p>
                  ) : (
                     <div className="divide-y divide-slate-100 animate-fadeIn">
                        {brands.map((brand) => (
                           <div key={brand.id} className="flex items-center justify-between py-4 group min-h-[64px]">
                              {editingBrandId === brand.id ? (
                                 <div className="flex items-center gap-3 w-full">
                                    <div 
                                       onClick={() => editBrandFileInputRef.current?.click()}
                                       className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 cursor-pointer hover:border-accent"
                                       title="Change Logo"
                                    >
                                       <Image
                                          src={editingBrandPreview || `https://ui-avatars.com/api/?name=${editingBrandName}`}
                                          alt={editingBrandName}
                                          fill
                                          className="object-contain p-1"
                                       />
                                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                          <UploadCloud className="h-4 w-4 text-white" />
                                       </div>
                                    </div>
                                    <input
                                       type="file"
                                       ref={editBrandFileInputRef}
                                       accept="image/*"
                                       onChange={handleEditBrandFileChange}
                                       className="hidden"
                                    />
                                    <input
                                       type="text"
                                       value={editingBrandName}
                                       onChange={(e) => setEditingBrandName(e.target.value)}
                                       className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition-all focus:border-accent focus:bg-white"
                                       placeholder="Brand name"
                                       autoFocus
                                    />
                                    <button
                                       onClick={() => handleUpdateBrand(brand.id)}
                                       disabled={isSavingBrand || !editingBrandName.trim()}
                                       className="rounded-xl p-2 bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white disabled:opacity-50"
                                       title="Save"
                                    >
                                       {isSavingBrand ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                       ) : (
                                          <Check className="h-4 w-4" />
                                       )}
                                    </button>
                                    <button
                                       onClick={handleCancelEditBrand}
                                       className="rounded-xl p-2 bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                                       title="Cancel"
                                    >
                                       <X className="h-4 w-4" />
                                    </button>
                                 </div>
                              ) : (
                                 <>
                                    <div className="flex items-center gap-3 min-w-0 pr-4">
                                       <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0">
                                          <Image
                                             src={brand.image || `https://ui-avatars.com/api/?name=${brand.name}&background=f8f9fa&color=6c757d`}
                                             alt={brand.name}
                                             fill
                                             className="object-contain p-1"
                                          />
                                       </div>
                                       <h4 className="text-sm font-bold text-slate-900 truncate">
                                          {brand.name}
                                       </h4>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                                       <button
                                          onClick={() => handleStartEditBrand(brand)}
                                          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-accent"
                                          title="Edit Brand"
                                       >
                                          <Edit2 className="h-4 w-4" />
                                       </button>
                                       <button
                                          onClick={() => handleDeleteClick(brand.id, 'brand', brand.name)}
                                          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                          title="Delete Brand"
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </button>
                                    </div>
                                 </>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Confirm Deletion Dialog */}
         <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            title={`Delete ${deleteTarget?.type === 'category' ? 'Category' : 'Brand'}`}
            message={`Are you sure you want to delete the ${deleteTarget?.type} "${deleteTarget?.name}"? Any items classified under this metadata will need to be reallocated. This operation is permanent.`}
            confirmText="Yes, Delete"
            type="danger"
            isLoading={isDeleting}
         />
      </div>
   );
}
