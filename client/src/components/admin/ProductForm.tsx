'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
   X,
   Plus,
   Trash2,
   Save,
   ArrowLeft,
   Loader2,
   AlertCircle,
   Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { productApi, categoryApi, brandApi } from '@/lib/api-client';
import type { Product, Category, Brand } from '@/types';
import CustomSelect from '../ui/CustomSelect';
import ConfirmDialog from '../ui/ConfirmDialog';
import { toast } from 'react-hot-toast';

interface ProductFormProps {
   initialData?: Product;
   isEditing?: boolean;
}

interface ImagePreview {
   url: string;
   file?: File;
   isExisting: boolean;
}

export default function ProductForm({
   initialData,
   isEditing = false,
}: ProductFormProps) {
   const router = useRouter();
   const fileInputRef = useRef<HTMLInputElement>(null);

   const [loading, setLoading] = useState(false);
   const [fetchingData, setFetchingData] = useState(true);
   const [categories, setCategories] = useState<Category[]>([]);
   const [brands, setBrands] = useState<Brand[]>([]);
   const [isConfirmOpen, setIsConfirmOpen] = useState(false);

   // Form State
   const [formData, setFormData] = useState({
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      countInStock: initialData?.countInStock || 0,
      category: initialData?.category?.id || '',
      brand: initialData?.brand?.id || '',
      status: initialData?.status || 'brandnew',
      availability:
         initialData?.availability !== undefined
            ? initialData.availability
            : true,
      warranty: {
         duration: initialData?.warranty?.duration || '',
         policy: initialData?.warranty?.policy || 'Standard Warranty',
      },
   });

   // Images state: combining existing URLs and new Files
   const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>(
      initialData?.images?.map((url) => ({ url, isExisting: true })) || []
   );

   const [specifications, setSpecifications] = useState<
      Array<{ label: string; value: string }>
   >(initialData?.specifications || [{ label: '', value: '' }]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [cats, brs] = await Promise.all([
               categoryApi.getAll(),
               brandApi.getAll(),
            ]);
            setCategories(cats);
            setBrands(brs);
         } catch (error) {
            console.error('Error fetching categories/brands:', error);
            toast.error('Failed to load categories or brands');
         } finally {
            setFetchingData(false);
         }
      };
      fetchData();
   }, []);

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      if (name.includes('.')) {
         const [parent, child] = name.split('.');
         if (parent === 'warranty') {
            setFormData((prev) => ({
               ...prev,
               warranty: {
                  ...prev.warranty,
                  [child]: value,
               },
            }));
         }
      } else {
         setFormData((prev) => ({
            ...prev,
            [name]:
               name === 'price' || name === 'countInStock'
                  ? Number(value)
                  : value,
         }));
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newPreviews: ImagePreview[] = Array.from(files).map((file) => ({
         url: URL.createObjectURL(file),
         file,
         isExisting: false,
      }));

      setImagePreviews((prev) => [...prev, ...newPreviews]);

      // Reset file input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
   };

   const removeImage = (index: number) => {
      const previewToRemove = imagePreviews[index];
      if (!previewToRemove.isExisting && previewToRemove.url) {
         URL.revokeObjectURL(previewToRemove.url);
      }
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
   };

   const handleAddSpec = () => {
      setSpecifications([...specifications, { label: '', value: '' }]);
   };

   const handleSpecChange = (
      index: number,
      field: 'label' | 'value',
      value: string
   ) => {
      const newSpecs = [...specifications];
      newSpecs[index][field] = value;
      setSpecifications(newSpecs);
   };

   const removeSpec = (index: number) => {
      setSpecifications(specifications.filter((_, i) => i !== index));
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Validations
      if (
         !formData.name ||
         !formData.description ||
         !formData.category ||
         !formData.brand
      ) {
         toast.error('Please fill in all required fields');
         return;
      }

      if (imagePreviews.length === 0) {
         toast.error('Please add at least one product image');
         return;
      }

      setIsConfirmOpen(true);
   };

   const handleConfirmSubmit = async () => {
      setLoading(true);
      try {
         const data = new FormData();

         // Basic info
         data.append('name', formData.name);
         data.append('description', formData.description);
         data.append('price', formData.price.toString());
         data.append('countInStock', formData.countInStock.toString());
         data.append('category', formData.category);
         data.append('brand', formData.brand);
         data.append('status', formData.status);
         data.append('availability', String(formData.availability));

         // Complex objects need to be stringified for multipart/form-data
         data.append('warranty', JSON.stringify(formData.warranty));
         data.append(
            'specifications',
            JSON.stringify(
               specifications.filter((spec) => spec.label && spec.value)
            )
         );

         // Append existing image URLs
         imagePreviews.forEach((p) => {
            if (p.isExisting) {
               data.append('images', p.url);
            } else if (p.file) {
               data.append('images', p.file);
            }
         });

         if (isEditing && initialData?.id) {
            await productApi.update(initialData.id, data);
            toast.success('Product updated successfully');
         } else {
            await productApi.create(data);
            toast.success('Product created successfully');
         }
         router.push('/admin/products');
         router.refresh();
      } catch (error: unknown) {
         const err = error as { message?: string };
         toast.error(err.message || 'Something went wrong');
      } finally {
         setLoading(false);
         setIsConfirmOpen(false);
      }
   };

   if (fetchingData) {
      return (
         <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
         </div>
      );
   }

   return (
      <div className="mx-auto max-w-5xl">
         <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button
                  onClick={() => router.back()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300"
               >
                  <ArrowLeft className="h-5 w-5" />
               </button>
               <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                     {isEditing ? 'Edit Product' : 'Create New Product'}
                  </h1>
                  <p className="text-sm font-medium text-slate-500">
                     {isEditing
                        ? `Modifying: ${initialData?.name}`
                        : 'Add a precision instrument to your catalog'}
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button
                  onClick={() => router.push('/admin/products')}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100"
               >
                  Cancel
               </button>
               <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 disabled:opacity-50"
               >
                  {loading ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <Save className="h-4 w-4" />
                  )}
                  {isEditing ? 'Update Product' : 'Publish Product'}
               </button>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
               {/* Main Info */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information Card */}
                  <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
                     <h2 className="mb-6 text-lg font-bold text-slate-900">
                        Basic Information
                     </h2>
                     <div className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                              Product Title{' '}
                              <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="e.g., iPhone 15 Pro Max"
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
                              required
                           />
                        </div>

                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                              Description{' '}
                              <span className="text-red-500">*</span>
                           </label>
                           <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              rows={5}
                              placeholder="Describe the product features and technical details..."
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10 resize-none"
                              required
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                                 Price (USD){' '}
                                 <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                    $
                                 </span>
                                 <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 py-3.5 text-sm font-bold outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
                                    required
                                    min="0"
                                 />
                              </div>
                           </div>

                           <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                                 Stock Quantity{' '}
                                 <span className="text-red-500">*</span>
                              </label>
                              <input
                                 type="number"
                                 name="countInStock"
                                 value={formData.countInStock}
                                 onChange={handleChange}
                                 className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
                                 required
                                 min="0"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Technical Specifications Card */}
                  <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
                     <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">
                           Technical Specifications
                        </h2>
                        <button
                           type="button"
                           onClick={handleAddSpec}
                           className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-100"
                        >
                           <Plus className="h-3 w-3" />
                           Add Spec
                        </button>
                     </div>

                     <div className="space-y-3">
                        {specifications.map((spec, index) => (
                           <div
                              key={index}
                              className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                           >
                              <div className="grid flex-1 grid-cols-2 gap-3">
                                 <input
                                    type="text"
                                    placeholder="Label (e.g. RAM)"
                                    value={spec.label}
                                    onChange={(e) =>
                                       handleSpecChange(
                                          index,
                                          'label',
                                          e.target.value
                                       )
                                    }
                                    className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-accent focus:bg-white"
                                 />
                                 <input
                                    type="text"
                                    placeholder="Value (e.g. 16GB)"
                                    value={spec.value}
                                    onChange={(e) =>
                                       handleSpecChange(
                                          index,
                                          'value',
                                          e.target.value
                                       )
                                    }
                                    className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-accent focus:bg-white"
                                 />
                              </div>
                              <button
                                 type="button"
                                 onClick={() => removeSpec(index)}
                                 className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
                              >
                                 <X className="h-4 w-4" />
                              </button>
                           </div>
                        ))}
                     </div>

                     {specifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200">
                           <AlertCircle className="mb-2 h-5 w-5 text-slate-300" />
                           <p className="text-xs font-bold text-slate-400">
                              No specifications added yet
                           </p>
                        </div>
                     )}
                  </div>

                  {/* Media/Images Card */}
                  <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
                     <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">
                           Product Media
                        </h2>
                        <button
                           type="button"
                           onClick={() => fileInputRef.current?.click()}
                           className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-black active:scale-95"
                        >
                           <Upload className="h-4 w-4" />
                           Upload Images
                        </button>
                        <input
                           type="file"
                           ref={fileInputRef}
                           onChange={handleFileChange}
                           multiple
                           accept="image/*"
                           className="hidden"
                        />
                     </div>

                     {imagePreviews.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                           {imagePreviews.map((preview, index) => (
                              <div
                                 key={index}
                                 className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
                              >
                                 <img
                                    src={preview.url}
                                    alt={`Preview ${index}`}
                                    className="h-full w-full object-cover"
                                 />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                 <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow-sm transition-all hover:bg-white active:scale-90"
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </button>
                                 <div className="absolute left-2 bottom-2 flex flex-col gap-1">
                                    {index === 0 && (
                                       <div className="rounded-md bg-accent px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white">
                                          Main
                                       </div>
                                    )}
                                    {!preview.isExisting && (
                                       <div className="rounded-md bg-emerald-500 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white">
                                          New
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))}
                           <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
                           >
                              <Plus className="mb-2 h-6 w-6" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                 Add More
                              </span>
                           </button>
                        </div>
                     ) : (
                        <div
                           onClick={() => fileInputRef.current?.click()}
                           className="flex flex-col items-center justify-center py-12 rounded-3xl bg-slate-50 border border-dashed border-slate-200 cursor-pointer transition-all hover:bg-slate-100 hover:border-slate-300"
                        >
                           <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm text-slate-400">
                              <Upload className="h-8 w-8" />
                           </div>
                           <p className="text-sm font-bold text-slate-500 text-center">
                              Click to upload product images
                              <br />
                              <span className="text-xs font-medium text-slate-400">
                                 Support JPG, PNG, WEBP (Max 5 images)
                              </span>
                           </p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Sidebar Settings */}
               <div className="space-y-6">
                  {/* Organization Card */}
                  <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
                     <h2 className="mb-6 text-lg font-bold text-slate-900">
                        Organization
                     </h2>
                     <div className="space-y-6">
                        <CustomSelect
                           label="Category"
                           options={categories}
                           value={formData.category}
                           onChange={(val) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 category: val,
                              }))
                           }
                           placeholder="Choose Category"
                        />

                        <CustomSelect
                           label="Brand"
                           options={brands}
                           value={formData.brand}
                           onChange={(val) =>
                              setFormData((prev) => ({ ...prev, brand: val }))
                           }
                           placeholder="Choose Brand"
                        />

                        <CustomSelect
                           label="Status"
                           options={[
                              { id: 'brandnew', name: 'Brand New' },
                              { id: 'refurbished', name: 'Refurbished' },
                              { id: 'limited', name: 'Limited Edition' },
                           ]}
                           value={formData.status}
                           onChange={(val) =>
                              setFormData((prev) => ({ ...prev, status: val }))
                           }
                        />

                        <CustomSelect
                           label="Availability"
                           options={[
                              {
                                 id: 'true',
                                 name: 'Available (Visible to Clients)',
                              },
                              { id: 'false', name: 'Unavailable (Archived)' },
                           ]}
                           value={formData.availability ? 'true' : 'false'}
                           onChange={(val) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 availability: val === 'true',
                              }))
                           }
                        />
                     </div>
                  </div>

                  {/* Warranty Card */}
                  <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
                     <h2 className="mb-6 text-lg font-bold text-slate-900">
                        Warranty Details
                     </h2>
                     <div className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                              Duration (e.g., 2 Years)
                           </label>
                           <input
                              type="text"
                              name="warranty.duration"
                              value={formData.warranty.duration}
                              onChange={handleChange}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
                           />
                        </div>

                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                              Policy / Scope
                           </label>
                           <input
                              type="text"
                              name="warranty.policy"
                              value={formData.warranty.policy}
                              onChange={handleChange}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Help/Support info */}
                  <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10">
                     <h3 className="mb-2 text-lg font-bold">Pro Tip</h3>
                     <p className="text-xs font-medium text-slate-400 leading-relaxed">
                        Adding detailed specifications helps customers make
                        informed decisions and reduces return rates for
                        precision electronics.
                     </p>
                  </div>
               </div>
            </div>
         </form>

         <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmSubmit}
            title={isEditing ? 'Update Product' : 'Create Product'}
            message={
               isEditing
                  ? `Are you sure you want to update "${formData.name}"? This will save all changes to the database.`
                  : `Are you sure you want to create the product "${formData.name}" and publish it to the store?`
            }
            confirmText={isEditing ? 'Yes, Update' : 'Yes, Create'}
            type="info"
            isLoading={loading}
         />
      </div>
   );
}
