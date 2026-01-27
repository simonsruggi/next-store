'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDemoProductsStore } from '@/lib/store/demo-products';
import { slugify } from '@/lib/utils';

export default function NewProductPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const categories = useDemoProductsStore((state) => state.categories);
  const addProduct = useDemoProductsStore((state) => state.addProduct);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    type: 'physical',
    categoryId: '',
    sku: '',
    stockQuantity: '0',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNameChange = (value: string) => {
    setForm({
      ...form,
      name: value,
      slug: slugify(value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const category = categories.find(c => c.id === form.categoryId);

    addProduct({
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: parseFloat(form.price),
      compare_at_price: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
      type: form.type as 'physical' | 'digital',
      category_id: form.categoryId || null,
      sku: form.sku || null,
      stock_quantity: parseInt(form.stockQuantity, 10),
      is_active: form.isActive,
      is_featured: form.isFeatured,
      digital_file_url: null,
      category: category || undefined,
      images: [],
    });

    router.push('/dashboard/products');
  };

  const isValid = form.name && form.price;

  if (!mounted) {
    return (
      <main className="p-6">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <Link href="/dashboard/products" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
          &larr; Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Product name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">Used in product URL</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="font-medium text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Compare at price</label>
                  <input
                    type="number"
                    value={form.compareAtPrice}
                    onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">To show a discount</p>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="font-medium text-gray-900 mb-4">Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stock quantity</label>
                  <input
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organization */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="font-medium text-gray-900 mb-4">Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  >
                    <option value="physical">Physical</option>
                    <option value="digital">Digital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  >
                    <option value="">None</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="font-medium text-gray-900 mb-4">Status</h2>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-0"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active (visible in store)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-0"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-colors ${
                isValid && !loading
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
