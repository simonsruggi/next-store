'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDemoOrdersStore } from '@/lib/store/demo-orders';
import { useDemoProductsStore } from '@/lib/store/demo-products';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const orders = useDemoOrdersStore((state) => state.orders);
  const products = useDemoProductsStore((state) => state.products);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate stats
  const paidOrders = orders.filter(o => o.payment_status === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 5);

  if (!mounted) {
    return (
      <main className="p-6">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Revenue" value={formatPrice(totalRevenue)} color="green" />
        <StatCard label="Orders" value={orders.length.toString()} color="blue" />
        <StatCard label="Products" value={products.length.toString()} color="amber" />
        <StatCard label="Customers" value={new Set(orders.map(o => o.customer_email)).size.toString()} color="purple" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No orders yet. Complete a checkout to see orders here.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/orders/${order.id}`} className="text-blue-600 hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-US')}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/products/new"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p className="text-sm font-medium text-gray-900">Add Product</p>
          <p className="text-xs text-gray-500 mt-1">Create a new product</p>
        </Link>
        <Link
          href="/dashboard/orders"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p className="text-sm font-medium text-gray-900">View Orders</p>
          <p className="text-xs text-gray-500 mt-1">Manage customer orders</p>
        </Link>
        <Link
          href="/dashboard/shipping"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p className="text-sm font-medium text-gray-900">Shipping</p>
          <p className="text-xs text-gray-500 mt-1">Configure shipping methods</p>
        </Link>
        <Link
          href="/dashboard/settings"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p className="text-sm font-medium text-gray-900">Settings</p>
          <p className="text-xs text-gray-500 mt-1">Store configuration</p>
        </Link>
      </div>
    </main>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${colors[color] || 'text-gray-900'}`}>
        {value}
      </p>
    </div>
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
    <span className={`px-2 py-1 text-xs rounded capitalize ${styles[status] || 'bg-gray-50 text-gray-700'}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 text-xs rounded capitalize ${
      status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
    }`}>
      {status}
    </span>
  );
}
