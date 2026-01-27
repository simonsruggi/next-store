'use client';

import { useState, useEffect } from 'react';
import { useDemoOrdersStore } from '@/lib/store/demo-orders';

interface Customer {
  id: string;
  name: string;
  email: string;
  orders_count: number;
  total_spent: number;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [mounted, setMounted] = useState(false);
  const orders = useDemoOrdersStore((state) => state.orders);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive customers from orders
  const customersMap = new Map<string, Customer>();

  orders.forEach((order) => {
    const existing = customersMap.get(order.customer_email);
    if (existing) {
      existing.orders_count += 1;
      existing.total_spent += order.total;
    } else {
      customersMap.set(order.customer_email, {
        id: order.customer_email,
        name: order.customer_name,
        email: order.customer_email,
        orders_count: 1,
        total_spent: order.total,
        created_at: order.created_at,
      });
    }
  });

  const customers = Array.from(customersMap.values()).sort(
    (a, b) => b.orders_count - a.orders_count
  );

  if (!mounted) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Customers</h1>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Customers</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium text-right">Orders</th>
              <th className="px-4 py-3 font-medium text-right">Total Spent</th>
              <th className="px-4 py-3 font-medium">First Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No customers yet. Complete a checkout to see customers here.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {customer.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {customer.name || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {customer.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {customer.orders_count}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                    ${customer.total_spent.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(customer.created_at).toLocaleDateString('en-US')}
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
