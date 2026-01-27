'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Cart</h1>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  const subtotal = getSubtotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Cart</h1>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Cart ({items.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Clear
        </button>
      </div>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const price = item.variant?.price ?? item.product.price;
          const maxStock = item.variant?.stock_quantity ?? item.product.stock_quantity;

          return (
            <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100">
              {/* Image */}
              <Link href={`/product/${item.product.slug}`} className="shrink-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="text-sm font-medium text-gray-900 truncate hover:text-gray-600">
                    {item.product.name}
                  </h3>
                </Link>
                {item.variant && (
                  <p className="text-xs text-gray-500 mt-0.5">{item.variant.name}</p>
                )}
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatPrice(price)}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= maxStock}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-gray-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatPrice(price * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-blue-600 py-1">
            Add {formatPrice(50 - subtotal)} for free shipping
          </p>
        )}

        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <Link
          href="/checkout"
          className="block w-full py-3 bg-black text-white text-center rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          Checkout
        </Link>
        <Link
          href="/"
          className="block w-full py-3 text-center text-sm text-gray-600 hover:text-gray-900"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
