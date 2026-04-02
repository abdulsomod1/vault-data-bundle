'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Input, Select, Button, Alert, Loader, Modal } from '@/components/common/UI';
import { authService } from '@/lib/auth';
import { walletAPI, orderAPI } from '@/lib/api';
import { User } from '@/types';
import { NETWORKS, DEFAULT_DATA_PLANS, DEFAULT_AIRTIME_PLANS } from '@/lib/constants';
import { formatCurrency, validatePhoneNumber } from '@/lib/utils';

export default function BuyDataPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);

  const [packageType, setPackageType] = useState<'data' | 'airtime'>('data');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const plans = packageType === 'data' ? DEFAULT_DATA_PLANS : DEFAULT_AIRTIME_PLANS;
  const networkPlans = plans.filter((p) => p.network === selectedNetwork);

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
      setUser(currentUser);

      const walletRes = await walletAPI.getBalance();
      if (walletRes.data) {
        setWalletBalance(walletRes.data.balance);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedNetwork) {
      setError('Please select a network');
      return;
    }

    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!selectedPlan && !customAmount) {
      setError('Please select a plan or enter a custom amount');
      return;
    }

    setShowConfirm(true);
  };

  const confirmOrder = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setError('');

    try {
      const amount = selectedPlan
        ? parseInt(selectedPlan)
        : parseInt(customAmount);

      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (amount > walletBalance) {
        throw new Error('Insufficient wallet balance');
      }

      const orderRes = await orderAPI.createOrder({
        network: selectedNetwork,
        packageType,
        amount,
        phoneNumber,
      });

      if (!orderRes.success) {
        throw new Error(orderRes.error || 'Failed to create order');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/orders');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
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

  const currentAmount = selectedPlan ? parseInt(selectedPlan) : (customAmount ? parseInt(customAmount) : 0);
  const sufficient = currentAmount <= walletBalance;

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Buy Data & Airtime</h1>
          <p className="text-gray-600">Wallet Balance: {formatCurrency(walletBalance)}</p>
        </div>

        {/* Error Alert */}
        {error && <Alert type="error" className="mb-6">{error}</Alert>}

        {/* Success Alert */}
        {success && (
          <Alert type="success" className="mb-6">
            Order created successfully! Redirecting...
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
          {/* Package Type Selection */}
          <div>
            <label className="form-label mb-3 block">Select Service Type</label>
            <div className="flex gap-4">
              {(['data', 'airtime'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setPackageType(type);
                    setSelectedPlan('');
                    setCustomAmount('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    packageType === type
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'data' ? '📱 Buy Data' : '📞 Buy Airtime'}
                </button>
              ))}
            </div>
          </div>

          {/* Network Selection */}
          <div>
            <label className="form-label mb-3 block">Select Network</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(NETWORKS).map(([key, network]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedNetwork(network.name);
                    setSelectedPlan('');
                  }}
                  className={`p-3 rounded-lg font-semibold transition text-sm ${
                    selectedNetwork === network.name
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {network.name}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number */}
          <Input
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+234 800 0000 000"
            error={phoneNumber && !validatePhoneNumber(phoneNumber) ? 'Invalid phone number' : ''}
          />

          {/* Plan Selection */}
          {selectedNetwork && networkPlans.length > 0 && (
            <div>
              <label className="form-label block mb-3">Select Plan</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {networkPlans.map((plan, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan.amount.toString());
                      setCustomAmount('');
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition text-left ${
                      selectedPlan === plan.amount.toString()
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{plan.name}</p>
                        {plan.validity && <p className="text-xs text-gray-500">{plan.validity}</p>}
                      </div>
                      <p className="font-bold text-primary">{formatCurrency(plan.amount)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Amount */}
          <div>
            <label className="form-label mb-3 block">Or Enter Custom Amount</label>
            <Input
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedPlan('');
              }}
              placeholder="Enter amount in Naira"
              min="50"
              max="500000"
            />
          </div>

          {/* Summary */}
          {currentAmount > 0 && (
            <div className="bg-gradient-primary text-white p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Service Type:</span>
                <span className="font-semibold">{packageType === 'data' ? 'Data' : 'Airtime'}</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-semibold">{selectedNetwork}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-semibold">{phoneNumber}</span>
              </div>
              <div className="border-t border-white border-opacity-30 pt-2 mt-2 flex justify-between text-lg">
                <span>Amount:</span>
                <span className="font-bold">{formatCurrency(currentAmount)}</span>
              </div>
              {!sufficient && (
                <div className="text-red-200 text-sm mt-2">
                  ⚠️ Insufficient wallet balance. Fund your wallet first.
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!currentAmount || !sufficient || submitting}
            loading={submitting}
            className="w-full"
          >
            Continue
          </Button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Order">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold">{packageType === 'data' ? 'Data' : 'Airtime'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-semibold">{selectedNetwork}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-semibold">{phoneNumber}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-semibold">Total:</span>
              <span className="font-bold text-lg text-primary">
                {formatCurrency(currentAmount)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={confirmOrder}
              loading={submitting}
              className="flex-1"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
