'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button, Alert, Loader, Select } from '@/components/common/UI';
import { authService } from '@/lib/auth';
import { orderAPI } from '@/lib/api';
import { User, Order } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter, networkFilter]);

  const loadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (networkFilter) filters.network = networkFilter;

      const res = await orderAPI.getOrders(1, 50, filters);
      if (res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-full">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-gray-600">View and manage all your orders</p>
        </div>

        {/* Alerts */}
        {error && <Alert type="error">{error}</Alert>}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'completed', label: 'Completed' },
                { value: 'failed', label: 'Failed' },
              ]}
            />

            <Select
              label="Filter by Network"
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              options={[
                { value: '', label: 'All Networks' },
                { value: 'MTN', label: 'MTN' },
                { value: 'Airtel', label: 'Airtel' },
                { value: 'Glo', label: 'Glo' },
                { value: '9mobile', label: '9mobile' },
              ]}
            />

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setStatusFilter('');
                  setNetworkFilter('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Network
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-700">
                        {order.reference?.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {order.network}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="capitalize">
                          {order.package_type === 'data' ? '📱 Data' : '📞 Airtime'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.phone_number}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[order.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDateTime(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No orders found</p>
              <Button variant="primary" onClick={() => router.push('/dashboard/buy')}>
                Make Your First Order
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
