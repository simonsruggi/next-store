'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import type { Product, Category } from '@/types';

interface DemoProductsState {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

export const useDemoProductsStore = create<DemoProductsState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      categories: mockCategories,

      addProduct: (productData) => {
        const id = `prod-${Date.now()}`;
        const now = new Date().toISOString();
        const category = get().categories.find(c => c.id === productData.category_id);

        const newProduct: Product = {
          ...productData,
          id,
          created_at: now,
          updated_at: now,
          category: category || undefined,
          images: productData.images || [],
        };

        set((state) => ({
          products: [newProduct, ...state.products],
        }));

        return newProduct;
      },

      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProduct: (id) => {
        return get().products.find((p) => p.id === id);
      },

      getProductBySlug: (slug) => {
        return get().products.find((p) => p.slug === slug);
      },
    }),
    {
      name: 'demo-products-storage',
    }
  )
);
