'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { useDemoOrdersStore } from '@/lib/store/demo-orders';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { items, getSubtotal, clearCart } = useCartStore();
  const addOrder = useDemoOrdersStore((state) => state.addOrder);

  const [form, setForm] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    payment: 'card',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const codFee = form.payment === 'cod' ? 3 : 0;
  const total = subtotal + shipping + codFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create demo order
    const order = addOrder({
      status: 'processing',
      payment_status: form.payment === 'cod' ? 'pending' : 'paid',
      payment_method: form.payment,
      customer_email: form.email,
      customer_name: form.name,
      shipping_address: `${form.address}, ${form.city} ${form.zip}`,
      items: items.map((item) => ({
        name: item.product.name + (item.variant ? ` - ${item.variant.name}` : ''),
        quantity: item.quantity,
        price: item.variant?.price ?? item.product.price,
      })),
      subtotal,
      shipping,
      total,
    });

    clearCart();
    router.push(`/checkout/success?order=${order.id}`);
  };

  const isValid = form.email && form.name && form.address && form.city && form.zip;

  if (!mounted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact */}
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Contact</h2>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          />
        </section>

        {/* Shipping */}
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Shipping</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
              <input
                type="text"
                placeholder="ZIP code"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Payment</h2>
          <div className="space-y-2">
            {[
              { id: 'card', label: 'Credit card' },
              { id: 'paypal', label: 'PayPal' },
              { id: 'cod', label: 'Cash on delivery (+$3)' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  form.payment === opt.id ? 'border-black bg-gray-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.id}
                  checked={form.payment === opt.id}
                  onChange={(e) => setForm({ ...form, payment: e.target.value })}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  form.payment === opt.id ? 'border-black' : 'border-gray-300'
                }`}>
                  {form.payment === opt.id && <span className="w-2 h-2 bg-black rounded-full" />}
                </span>
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Summary</h2>

          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.name} x {item.quantity}
                </span>
                <span>{formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            {form.payment === 'cod' && (
              <div className="flex justify-between">
                <span className="text-gray-500">COD fee</span>
                <span>{formatPrice(3)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between font-semibold text-lg mt-3 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
            isValid && !loading
              ? 'bg-black text-white hover:bg-gray-800 active:scale-[0.99]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : 'Complete order'}
        </button>

        <p className="text-xs text-center text-gray-400">
          By clicking "Complete order" you agree to our terms and conditions
        </p>
      </form>
    </main>
  );
}
