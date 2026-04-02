'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Input, Button, Alert, Loader, StatCard } from '@/components/common/UI';
import { authService } from '@/lib/auth';
import { walletAPI } from '@/lib/api';
import { User, Transaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [fundAmount, setFundAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    document.body.appendChild(script);
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      const walletRes = await walletAPI.getBalance();
      if (walletRes.data) {
        setBalance(walletRes.data.balance);
      }

      await loadTransactions();
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (pageNum = 1) => {
    try {
      const res = await walletAPI.getTransactionHistory(pageNum, 10);
      if (res.data) {
        setTransactionsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load transactions', err);
    }
  };

  const handleFundWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseInt(fundAmount);
    if (!amount || amount < 100 || amount > 500000) {
      setError('Amount must be between ₦100 and ₦500,000');
      return;
    }

    setSubmitting(true);

    try {
      const fundRes = await walletAPI.fundWallet(amount, '');

      if (!fundRes.success) {
        throw new Error(fundRes.error || 'Failed to initiate payment');
      }

      if (!user) throw new Error('User not found');

      // Initialize Paystack
      if (window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email: user.email,
          amount: amount * 100,
          ref: fundRes.data.reference,
          onClose: () => {
            setSubmitting(false);
          },
          onSuccess: async () => {
            // Verify transaction
            const verifyRes = await walletAPI.verifyTransaction(fundRes.data.reference);
            if (verifyRes.success) {
              setSuccess(`Wallet funded successfully with ${formatCurrency(amount)}`);
              setFundAmount('');
              setBalance(verifyRes.data.balance);
              await loadTransactions();
            }
          },
        });
        handler.openIframe();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fund wallet');
      setSubmitting(false);
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

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wallet Management</h1>
          <p className="text-gray-600">Manage your wallet balance and transactions</p>
        </div>

        {/* Current Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            icon="💰"
            label="Current Balance"
            value={formatCurrency(balance)}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon="📊"
            label="Total Transactions"
            value={transactionsData.length}
            color="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Alerts */}
        {error && <Alert type="error" className="mb-6">{error}</Alert>}
        {success && <Alert type="success" className="mb-6">{success}</Alert>}

        {/* Fund Wallet Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Fund Your Wallet</h2>

          <form onSubmit={handleFundWallet} className="space-y-6">
            {/* Amount Input */}
            <Input
              label="Amount to Fund (₦)"
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder="Enter amount"
              min="100"
              max="500000"
            />

            {/* Predefined Amounts */}
            <div>
              <label className="form-label block mb-3">Quick Amounts</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {predefinedAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFundAmount(amt.toString())}
                    className={`p-3 rounded-lg font-semibold transition text-sm ${
                      fundAmount === amt.toString()
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ₦{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {fundAmount && (
              <div className="bg-gradient-primary text-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Amount to Fund:</span>
                  <span className="font-bold text-lg">{formatCurrency(parseInt(fundAmount))}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!fundAmount || submitting}
              loading={submitting}
              className="w-full"
            >
              {submitting ? 'Processing...' : 'Fund Wallet with Paystack'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              You will be redirected to Paystack to complete the payment
            </p>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Transaction History</h2>
          </div>

          {transactionsData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDateTime(transaction.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            transaction.type === 'credit'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {transaction.type === 'credit' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {formatCurrency(transaction.balance_after || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">No transactions yet</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
