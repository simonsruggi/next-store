'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDemoOrdersStore } from '@/lib/store/demo-orders';
import { formatPrice } from '@/lib/utils';

export default function AccountOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const orders = useDemoOrdersStore((state) => state.orders);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/account" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to Account
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">My Orders</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Items</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                  <Link
                    href="/products"
                    className="inline-block px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                  >
                    Browse Products
                  </Link>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/checkout/success?order=${order.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    processing: 'bg-blue-50 text-blue-700',
    shipped: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <span className={`px-2 py-1 text-xs rounded capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
