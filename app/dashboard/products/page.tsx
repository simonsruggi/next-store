'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDemoProductsStore } from '@/lib/store/demo-products';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [mounted, setMounted] = useState(false);
  const products = useDemoProductsStore((state) => state.products);
  const deleteProduct = useDemoProductsStore((state) => state.deleteProduct);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  if (!mounted) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        </div>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800"
        >
          + New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No products. Start by adding one!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            ?
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        {product.sku && (
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      product.type === 'digital' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.type === 'digital' ? 'Digital' : 'Physical'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right ${
                    product.stock_quantity <= 5 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {product.stock_quantity}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      product.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
