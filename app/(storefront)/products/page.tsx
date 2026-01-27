'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { useDemoProductsStore } from '@/lib/store/demo-products';
import AddToCartMinimal from '@/components/storefront/AddToCartMinimal';

function ProductsContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const products = useDemoProductsStore((state) => state.products);
  const categories = useDemoProductsStore((state) => state.categories);

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const sortBy = searchParams.get('sort');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and sort products
  let filteredProducts = [...products].filter(p => p.is_active);

  if (categorySlug) {
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category_id === category.id);
    }
  }

  if (searchQuery) {
    const search = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(search));
  }

  switch (sortBy) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  if (!mounted) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
      {/* Header */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{currentCategory?.name || 'All Products'}</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900">
          {currentCategory?.name || 'All Products'}
        </h1>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-48 shrink-0 hidden md:block">
          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className={`text-sm ${!categorySlug ? 'text-black font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`text-sm ${categorySlug === cat.slug ? 'text-black font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Sort by</h3>
            <ul className="space-y-2">
              {[
                { value: '', label: 'Newest' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'name', label: 'Name' },
              ].map((opt) => (
                <li key={opt.value}>
                  <Link
                    href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}${opt.value ? `sort=${opt.value}` : ''}`}
                    className={`text-sm ${(sortBy || '') === opt.value ? 'text-black font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {opt.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
              <Link href="/products" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
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
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </main>
    }>
      <ProductsContent />
    </Suspense>
  );
}
