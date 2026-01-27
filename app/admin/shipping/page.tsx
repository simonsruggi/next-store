'use client';

import { useState, useEffect } from 'react';
import { useDemoShippingStore } from '@/lib/store/demo-shipping';
import { formatPrice } from '@/lib/utils';

export default function AdminShippingPage() {
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const methods = useDemoShippingStore((state) => state.methods);
  const addMethod = useDemoShippingStore((state) => state.addMethod);
  const updateMethod = useDemoShippingStore((state) => state.updateMethod);
  const deleteMethod = useDemoShippingStore((state) => state.deleteMethod);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    estimatedDaysMin: '1',
    estimatedDaysMax: '5',
    isActive: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenDialog = (methodId?: string) => {
    if (methodId) {
      const method = methods.find(m => m.id === methodId);
      if (method) {
        setEditingId(methodId);
        setForm({
          name: method.name,
          description: method.description || '',
          price: method.price.toString(),
          estimatedDaysMin: method.estimated_days_min.toString(),
          estimatedDaysMax: method.estimated_days_max.toString(),
          isActive: method.is_active,
        });
      }
    } else {
      setEditingId(null);
      setForm({
        name: '',
        description: '',
        price: '',
        estimatedDaysMin: '1',
        estimatedDaysMax: '5',
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const handleSave = () => {
    const data = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      estimated_days_min: parseInt(form.estimatedDaysMin, 10),
      estimated_days_max: parseInt(form.estimatedDaysMax, 10),
      is_active: form.isActive,
    };

    if (editingId) {
      updateMethod(editingId, data);
    } else {
      addMethod(data);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shipping method?')) {
      deleteMethod(id);
    }
  };

  if (!mounted) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Methods</h1>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Shipping Methods</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + New Method
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium">Delivery Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {methods.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No shipping methods configured
                </td>
              </tr>
            ) : (
              methods.map((method) => (
                <tr key={method.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {method.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {method.description || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatPrice(method.price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {method.estimated_days_min}-{method.estimated_days_max} days
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      method.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {method.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenDialog(method.id)}
                      className="text-sm text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
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

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">
                {editingId ? 'Edit Shipping Method' : 'New Shipping Method'}
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min days</label>
                  <input
                    type="number"
                    value={form.estimatedDaysMin}
                    onChange={(e) => setForm({ ...form, estimatedDaysMin: e.target.value })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max days</label>
                  <input
                    type="number"
                    value={form.estimatedDaysMax}
                    onChange={(e) => setForm({ ...form, estimatedDaysMax: e.target.value })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-0"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.price}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {editingId ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
