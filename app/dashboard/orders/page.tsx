'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDemoOrdersStore, DemoOrder } from '@/lib/store/demo-orders';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const orders = useDemoOrdersStore((state) => state.orders);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Orders</h1>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Orders</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No orders yet. Complete a checkout to see orders here.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-blue-600">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={order.payment_status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </Link>
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

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    paid: 'bg-green-50 text-green-700',
  };

  return (
    <span className={`px-2 py-1 text-xs rounded capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
