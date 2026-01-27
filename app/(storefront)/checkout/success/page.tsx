'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDemoOrdersStore, DemoOrder } from '@/lib/store/demo-orders';
import { formatPrice } from '@/lib/utils';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [mounted, setMounted] = useState(false);
  const getOrder = useDemoOrdersStore((state) => state.getOrder);

  useEffect(() => {
    setMounted(true);
    if (orderId) {
      const foundOrder = getOrder(orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId, getOrder]);

  if (!mounted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Order not found</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500">
          Thank you for your order. We've sent a confirmation to {order.customer_email}
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">Order number</p>
            <p className="font-semibold text-gray-900">{order.order_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Date</p>
            <p className="text-gray-900">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-sm text-gray-500 mb-2">Shipping to</p>
          <p className="text-gray-900">{order.customer_name}</p>
          <p className="text-gray-600">{order.shipping_address}</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 mb-2">Payment</p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded ${
              order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
            </span>
            <span className="text-sm text-gray-600 capitalize">{order.payment_method}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">Order Items</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items.map((item, index) => (
            <div key={index} className="p-4 flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/"
          className="flex-1 py-3 text-center bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
        <Link
          href="/admin/orders"
          className="flex-1 py-3 text-center border border-gray-200 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50"
        >
          View in Admin
        </Link>
      </div>
    </main>
  );
}
