'use client';

import { useState, useEffect } from 'react';
import { useDemoSettingsStore } from '@/lib/store/demo-settings';

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  const store = useDemoSettingsStore((state) => state.store);
  const payments = useDemoSettingsStore((state) => state.payments);
  const updateStoreSettings = useDemoSettingsStore((state) => state.updateStoreSettings);
  const updatePaymentSettings = useDemoSettingsStore((state) => state.updatePaymentSettings);

  const [storeForm, setStoreForm] = useState(store);
  const [paymentForm, setPaymentForm] = useState(payments);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setStoreForm(store);
    setPaymentForm(payments);
  }, [store, payments]);

  const handleSave = () => {
    updateStoreSettings(storeForm);
    updatePaymentSettings(paymentForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        {saved && (
          <span className="text-sm text-green-600">Settings saved!</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="font-medium text-gray-900 mb-4">Store Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Store name</label>
              <input
                type="text"
                value={storeForm.name}
                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Currency</label>
                <input
                  type="text"
                  value={storeForm.currency}
                  onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Symbol</label>
                <input
                  type="text"
                  value={storeForm.currencySymbol}
                  onChange={(e) => setStoreForm({ ...storeForm, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax & Shipping */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="font-medium text-gray-900 mb-4">Tax & Shipping</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tax rate (%)</label>
              <input
                type="number"
                value={storeForm.taxRate}
                onChange={(e) => setStoreForm({ ...storeForm, taxRate: parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Free shipping threshold</label>
              <input
                type="number"
                value={storeForm.freeShippingThreshold || ''}
                onChange={(e) => setStoreForm({
                  ...storeForm,
                  freeShippingThreshold: e.target.value ? parseFloat(e.target.value) : null,
                })}
                min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">Leave empty to disable</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:col-span-2">
          <h2 className="font-medium text-gray-900 mb-4">Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={paymentForm.stripe}
                onChange={(e) => setPaymentForm({ ...paymentForm, stripe: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-0"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Stripe</span>
                <p className="text-xs text-gray-500">Credit card payments via Stripe</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={paymentForm.paypal}
                onChange={(e) => setPaymentForm({ ...paymentForm, paypal: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-0"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">PayPal</span>
                <p className="text-xs text-gray-500">Payments via PayPal account</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={paymentForm.cod}
                onChange={(e) => setPaymentForm({ ...paymentForm, cod: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-0"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Cash on Delivery</span>
                <p className="text-xs text-gray-500">Payment at delivery</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </main>
  );
}
