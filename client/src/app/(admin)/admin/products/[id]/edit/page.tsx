'use client';

import React, { useState, useEffect, use } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { productApi } from '@/lib/api-client';
import type { Product } from '@/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-black text-slate-900">Product not found</h2>
        <p className="text-slate-500">The product you are trying to edit does not exist or has been removed.</p>
      </div>
    );
  }

  return <ProductForm initialData={product} isEditing />;
}
