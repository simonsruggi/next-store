import { isDemoMode } from '@/lib/mock-data';

const mockCustomers = [
  { id: '1', full_name: 'John Doe', email: 'john@example.com', phone: '+1 555-0101', orders_count: 5, created_at: '2025-01-15' },
  { id: '2', full_name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555-0102', orders_count: 3, created_at: '2025-01-18' },
  { id: '3', full_name: 'Bob Johnson', email: 'bob@example.com', phone: null, orders_count: 1, created_at: '2025-01-20' },
  { id: '4', full_name: 'Alice Brown', email: 'alice@example.com', phone: '+1 555-0104', orders_count: 8, created_at: '2025-01-10' },
  { id: '5', full_name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1 555-0105', orders_count: 2, created_at: '2025-01-22' },
];

async function getCustomers() {
  if (isDemoMode()) {
    return mockCustomers;
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select(`*, orders:orders(count)`)
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Customers</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium text-right">Orders</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No customers yet
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {customer.full_name?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {customer.full_name || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {customer.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {customer.phone || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {customer.orders_count || customer.orders?.[0]?.count || 0}
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
