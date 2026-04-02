'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard, WalletCard, NetworkCard, TransactionItem } from '@/components/dashboard/Cards';
import { Button, Loader, Alert } from '@/components/common/UI';
import { authService } from '@/lib/auth';
import { User, Wallet, Transaction } from '@/types';
import { walletAPI, orderAPI } from '@/lib/api';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { NETWORKS } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Get wallet balance
      const walletRes = await walletAPI.getBalance();
      if (walletRes.data) {
        setWallet(walletRes.data);
      }

      // Get transactions
      const transRes = await walletAPI.getTransactionHistory(1, 5);
      if (transRes.data) {
        setTransactions(transRes.data);
      }

      // Get orders
      const ordersRes = await orderAPI.getOrders(1, 5);
      if (ordersRes.data) {
        setOrders(ordersRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
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
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600">Manage your VTU services and wallet here</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert type="error">{error}</Alert>
        )}

        {/* Wallet Card */}
        <WalletCard
          balance={wallet?.balance || 0}
          onFund={() => router.push('/dashboard/wallet')}
          onBuyData={() => router.push('/dashboard/buy')}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon="📦"
            label="Total Orders"
            value={orders.length}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            icon="✓"
            label="Completed"
            value={orders.filter((o) => o.status === 'completed').length}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon="⏳"
            label="Pending"
            value={orders.filter((o) => o.status === 'pending').length}
            color="bg-yellow-100 text-yellow-600"
          />
        </div>

        {/* Quick Actions - Networks */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Buy</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(NETWORKS).map(([key, network]) => (
              <NetworkCard
                key={key}
                network={network.name}
                icon="📱"
                color={`bg-gradient-to-br from-${key.toLowerCase()}-400 to-${key.toLowerCase()}-600`}
                onClick={() => router.push('/dashboard/buy')}
              />
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <Link href="/dashboard/wallet" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div>
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  type={transaction.type}
                  description={transaction.description}
                  amount={transaction.amount}
                  status={transaction.status}
                  date={formatDateTime(transaction.created_at)}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No transactions yet</div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {orders.length > 0 ? (
              orders.slice(0, 3).map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{`${order.package_type} - ${order.network}`}</p>
                      <p className="text-sm text-gray-600">{order.phone_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(order.amount)}</p>
                      <span className={`badge ${order.status === 'completed' ? 'badge-success' : order.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-4">No orders yet</p>
                <Link href="/dashboard/buy">
                  <Button variant="primary">Make Your First Order</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
