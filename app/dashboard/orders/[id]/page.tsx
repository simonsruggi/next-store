'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDemoOrdersStore, DemoOrder } from '@/lib/store/demo-orders';
import { formatPrice } from '@/lib/utils';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const getOrder = useDemoOrdersStore((state) => state.getOrder);
  const updateOrderStatus = useDemoOrdersStore((state) => state.updateOrderStatus);

  useEffect(() => {
    setMounted(true);
    if (orderId) {
      const foundOrder = getOrder(orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId, getOrder]);

  const handleStatusChange = (newStatus: DemoOrder['status']) => {
    updateOrderStatus(orderId, newStatus);
    setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
  };

  if (!mounted) {
    return (
      <main className="p-6">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="p-6">
        <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Orders
        </Link>
        <p className="text-gray-500">Order not found</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard/orders" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            &larr; Back to Orders
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{order.order_number}</h1>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.payment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-900">Order Items</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatPrice(item.price)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* Update Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-medium text-gray-900 mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {(['pending', 'processing', 'shipped', 'delivered'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 text-sm rounded-lg capitalize transition-colors ${
                    order.status === status
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-medium text-gray-900 mb-3">Customer</h2>
            <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
            <p className="text-sm text-gray-600">{order.customer_email}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-medium text-gray-900 mb-3">Shipping Address</h2>
            <p className="text-sm text-gray-600">{order.customer_name}</p>
            <p className="text-sm text-gray-600">{order.shipping_address}</p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-medium text-gray-900 mb-3">Payment</h2>
            <p className="text-sm text-gray-600 capitalize">{order.payment_method}</p>
            <div className="mt-2">
              <PaymentBadge status={order.payment_status} />
            </div>
          </div>
        </div>
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
  };

  return (
    <span className={`px-2 py-1 text-xs rounded capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
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
