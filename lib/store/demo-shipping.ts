'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockShippingMethods } from '@/lib/mock-data';
import type { ShippingMethod } from '@/types';

interface DemoShippingState {
  methods: ShippingMethod[];
  addMethod: (method: Omit<ShippingMethod, 'id' | 'created_at'>) => ShippingMethod;
  updateMethod: (id: string, data: Partial<ShippingMethod>) => void;
  deleteMethod: (id: string) => void;
  getMethod: (id: string) => ShippingMethod | undefined;
}

export const useDemoShippingStore = create<DemoShippingState>()(
  persist(
    (set, get) => ({
      methods: mockShippingMethods,

      addMethod: (methodData) => {
        const id = `ship-${Date.now()}`;
        const newMethod: ShippingMethod = {
          ...methodData,
          id,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          methods: [...state.methods, newMethod],
        }));

        return newMethod;
      },

      updateMethod: (id, data) => {
        set((state) => ({
          methods: state.methods.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        }));
      },

      deleteMethod: (id) => {
        set((state) => ({
          methods: state.methods.filter((m) => m.id !== id),
        }));
      },

      getMethod: (id) => {
        return get().methods.find((m) => m.id === id);
      },
    }),
    {
      name: 'demo-shipping-storage',
    }
  )
);
