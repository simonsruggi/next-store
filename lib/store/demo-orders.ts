'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DemoOrder {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  payment_status: 'pending' | 'paid';
  payment_method: string;
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
}

interface DemoOrdersState {
  orders: DemoOrder[];
  addOrder: (order: Omit<DemoOrder, 'id' | 'order_number' | 'created_at'>) => DemoOrder;
  getOrder: (id: string) => DemoOrder | undefined;
  updateOrderStatus: (id: string, status: DemoOrder['status']) => void;
}

export const useDemoOrdersStore = create<DemoOrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const id = `order-${Date.now()}`;
        const order_number = `ORD-${String(get().orders.length + 1).padStart(4, '0')}`;
        const newOrder: DemoOrder = {
          ...orderData,
          id,
          order_number,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      getOrder: (id) => {
        return get().orders.find((o) => o.id === id);
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        }));
      },
    }),
    {
      name: 'demo-orders-storage',
    }
  )
);
