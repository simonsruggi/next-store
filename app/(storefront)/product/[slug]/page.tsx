'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useDemoProductsStore } from '@/lib/store/demo-products';
import ProductVariantSelectorMinimal from '@/components/storefront/ProductVariantSelectorMinimal';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [mounted, setMounted] = useState(false);
  const products = useDemoProductsStore((state) => state.products);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = products.find(p => p.slug === slug && p.is_active);

  if (!mounted) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Product not found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to store
        </Link>
      </main>
    );
  }

  const mainImage = product.images?.[0];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-sm text-gray-500 hover:text-gray-700 uppercase tracking-wide"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl font-semibold text-gray-900 mt-1 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {product.type === 'digital' && (
              <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">
                Digital
              </span>
            )}
            {product.stock_quantity > 0 ? (
              <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded">
                In stock
              </span>
            ) : (
              <span className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded">
                Sold out
              </span>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6 mb-6">
            <ProductVariantSelectorMinimal
              product={product}
              variants={product.variants || []}
            />
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-sm font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
