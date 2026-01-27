'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { useDemoProductsStore } from '@/lib/store/demo-products';

export default function HeaderMinimal() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const categories = useDemoProductsStore((state) => state.categories);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 -ml-2 md:hidden"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="text-lg font-semibold text-gray-900">
            Store
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-1 ml-8">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
              All Products
            </Link>
            {mounted && categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Admin link */}
            <Link
              href="/admin"
              className="hidden sm:flex text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              Admin
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-black text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
              <span className="font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 -mr-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50"
                >
                  All Products
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Categories
                </p>
                <div className="space-y-1">
                  {mounted && categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50"
                >
                  <span>Cart</span>
                  {mounted && itemCount > 0 && (
                    <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Admin Panel
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
