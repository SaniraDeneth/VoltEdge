'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';
import { productApi, categoryApi, brandApi } from '@/lib/api-client';
import type { Product, Pagination, Category, Brand } from '@/types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '@/components/ui/CustomSelect';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [page, setPage] = useState(1);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInitialData = async () => {
    try {
      const [cats, brs] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll()
      ]);
      setCategories(cats);
      setBrands(brs);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll({
        search: searchTerm,
        category: selectedCategory,
        brand: selectedBrand,
        page,
        limit: 10,
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedBrand, page]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await productApi.delete(deletingId);
      toast.success('Product deleted successfully');
      fetchProducts();
      setIsConfirmOpen(false);
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Products</h1>
          <p className="text-sm font-medium text-slate-500">Manage your precision instrument inventory</p>
        </div>
        
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      {/* Search & Global Filter Toggle */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name..."
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
            {(selectedCategory || selectedBrand || searchTerm) && (
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
              className=""
            >
              <div className="grid grid-cols-1 gap-6 rounded-3xl bg-white border border-slate-100 p-8 sm:grid-cols-2 lg:grid-cols-3 shadow-sm">
                <CustomSelect
                  label="Category"
                  placeholder="All Categories"
                  options={categories.map(cat => ({ id: cat.id, name: cat.name }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
                
                <CustomSelect
                  label="Brand"
                  placeholder="All Brands"
                  options={brands.map(brand => ({ id: brand.id, name: brand.name }))}
                  value={selectedBrand}
                  onChange={setSelectedBrand}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product from your inventory."
        confirmText="Yes, Delete Product"
        isLoading={isDeleting}
      />

      {/* Products Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Brand</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stock</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent" />
                    <p className="mt-4 text-sm font-bold text-slate-400">Loading inventory...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                      <Package className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="mt-4 text-sm font-bold text-slate-400">No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">ID: {product.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                      {product.brand?.name || 'VoltEdge'}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${product.countInStock > 10 ? 'bg-emerald-500' : product.countInStock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <span className={`text-sm font-bold ${product.countInStock === 0 ? 'text-rose-500' : 'text-slate-600'}`}>
                          {product.countInStock} units
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 transition-all hover:border-accent hover:text-accent hover:shadow-sm"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          disabled={isDeleting}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 transition-all hover:border-red-500 hover:text-red-500 hover:shadow-sm disabled:opacity-30"
                          title="Delete"
                        >
                          {isDeleting && deletingId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                        <Link
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 transition-all hover:border-slate-900 hover:text-slate-900 hover:shadow-sm"
                          title="View on Store"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-50 px-6 py-4">
            <p className="text-xs font-bold text-slate-400">
              Showing page <span className="text-slate-900">{pagination.currentPage}</span> of <span className="text-slate-900">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 transition-all hover:border-accent hover:text-accent disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 transition-all hover:border-accent hover:text-accent disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
