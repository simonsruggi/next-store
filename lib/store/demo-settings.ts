'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreSettings {
  name: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  freeShippingThreshold: number | null;
}

interface PaymentSettings {
  stripe: boolean;
  paypal: boolean;
  cod: boolean;
}

interface DemoSettingsState {
  store: StoreSettings;
  payments: PaymentSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => void;
}

export const useDemoSettingsStore = create<DemoSettingsState>()(
  persist(
    (set) => ({
      store: {
        name: 'Next Store',
        currency: 'USD',
        currencySymbol: '$',
        taxRate: 0,
        freeShippingThreshold: 50,
      },
      payments: {
        stripe: true,
        paypal: true,
        cod: true,
      },

      updateStoreSettings: (settings) => {
        set((state) => ({
          store: { ...state.store, ...settings },
        }));
      },

      updatePaymentSettings: (settings) => {
        set((state) => ({
          payments: { ...state.payments, ...settings },
        }));
      },
    }),
    {
      name: 'demo-settings-storage',
    }
  )
);
