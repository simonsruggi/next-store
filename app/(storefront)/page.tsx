'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useDemoProductsStore } from '@/lib/store/demo-products';
import AddToCartMinimal from '@/components/storefront/AddToCartMinimal';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const products = useDemoProductsStore((state) => state.products);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeProducts = products.filter(p => p.is_active);

  if (!mounted) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeProducts.map((product) => (
          <article key={product.id} className="group">
            <Link href={`/product/${product.slug}`} className="block">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </Link>

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Link href={`/product/${product.slug}`}>
                  <h2 className="text-sm font-medium text-gray-900 truncate hover:text-gray-600">
                    {product.name}
                  </h2>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
              </div>

              <AddToCartMinimal product={product} />
            </div>
          </article>
        ))}
      </div>

      {activeProducts.length === 0 && (
        <p className="text-center text-gray-500 py-20">
          No products available
        </p>
      )}
    </main>
  );
}
