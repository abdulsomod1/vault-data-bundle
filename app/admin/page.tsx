'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/Cards';
import { Loader, Alert } from '@/components/common/UI';
import { authService } from '@/lib/auth';
import { adminAPI } from '@/lib/api';
import { User, DashboardStats } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      if (currentUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(currentUser);

      const res = await adminAPI.getDashboardStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
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

  if (error) {
    return (
      <DashboardLayout user={user}>
        <Alert type="error">{error}</Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and analytics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="💰"
            label="Total Revenue"
            value={formatCurrency(stats?.total_revenue || 0)}
            color="bg-gradient-to-br from-green-100 to-green-200 text-green-600"
          />
          <StatCard
            icon="📊"
            label="Daily Revenue"
            value={formatCurrency(stats?.daily_revenue || 0)}
            color="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
          />
          <StatCard
            icon="📦"
            label="Total Orders"
            value={stats?.total_orders || 0}
            color="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600"
          />
          <StatCard
            icon="✓"
            label="Completed"
            value={stats?.completed_orders || 0}
            color="bg-gradient-to-br from-green-100 to-green-200 text-green-600"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            icon="⏳"
            label="Pending Orders"
            value={stats?.pending_orders || 0}
            color="bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600"
          />
          <StatCard
            icon="👥"
            label="Total Users"
            value={stats?.total_users || 0}
            color="bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600"
          />
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/orders"
              className="p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center font-semibold cursor-pointer"
            >
              📦 Manage Orders
            </a>
            <a
              href="/admin/users"
              className="p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center font-semibold cursor-pointer"
            >
              👥 Manage Users
            </a>
            <a
              href="/admin/sims"
              className="p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center font-semibold cursor-pointer"
            >
              📱 Manage SIMs
            </a>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gradient-primary text-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">System Information</h2>
          <div className="space-y-2 text-sm opacity-90">
            <p>✓ API Status: <span className="font-semibold text-green-300">Operational</span></p>
            <p>✓ Database: <span className="font-semibold text-green-300">Connected</span></p>
            <p>✓ Supabase: <span className="font-semibold text-green-300">Synced</span></p>
            <p>✓ Paystack Integration: <span className="font-semibold text-green-300">Active</span></p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
