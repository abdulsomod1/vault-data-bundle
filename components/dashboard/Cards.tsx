import React from 'react';
import { Card } from '@/components/common/UI';
import { formatCurrency } from '@/lib/utils';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color = 'bg-blue-100 text-blue-600',
}) => {
  return (
    <Card className="hover:shadow-lg transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

interface WalletCardProps {
  balance: number;
  onFund?: () => void;
  onBuyData?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ balance, onFund, onBuyData }) => {
  return (
    <Card className="bg-gradient-primary text-white">
      <div className="mb-8">
        <p className="text-sm opacity-90 mb-1">Wallet Balance</p>
        <p className="text-4xl font-bold">{formatCurrency(balance)}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onFund}
          className="flex-1 bg-white text-primary py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Fund Wallet
        </button>
        <button
          onClick={onBuyData}
          className="flex-1 bg-white bg-opacity-20 text-white py-2 rounded-lg font-semibold hover:bg-opacity-30 transition"
        >
          Buy Data
        </button>
      </div>
    </Card>
  );
};

interface NetworkCardProps {
  network: string;
  icon: string;
  color: string;
  onClick?: () => void;
}

export const NetworkCard: React.FC<NetworkCardProps> = ({ network, icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg text-white font-bold flex flex-col items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer ${color}`}
    >
      <span className="text-3xl">{icon}</span>
      <span>{network}</span>
    </button>
  );
};

interface TransactionItemProps {
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  description,
  amount,
  status,
  date,
}) => {
  const statusColor = {
    completed: 'text-green-600 bg-green-50',
    pending: 'text-yellow-600 bg-yellow-50',
    failed: 'text-red-600 bg-red-50',
  };

  const typeColor = type === 'credit' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div>
        <p className="font-medium">{description}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="text-right">
        <p className={`font-bold ${typeColor}`}>
          {type === 'credit' ? '+' : '-'}
          {formatCurrency(amount)}
        </p>
        <p className={`text-xs font-medium px-2 py-1 rounded inline-block ${statusColor[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
      </div>
    </div>
  );
};

interface OrderItemProps {
  reference: string;
  network: string;
  type: string;
  amount: number;
  status: string;
  phone: string;
  date: string;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  reference,
  network,
  type,
  amount,
  status,
  phone,
  date,
}) => {
  const statusColor = {
    completed: 'badge-success',
    processing: 'badge-warning',
    pending: 'badge-primary',
    failed: 'badge-danger',
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold">{`${type} - ${network}`}</p>
          <p className="text-sm text-gray-600">{phone}</p>
          <p className="text-xs text-gray-500">{reference}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatCurrency(amount)}</p>
          <p className={`text-xs badge ${statusColor[status as keyof typeof statusColor]}`}>
            {status}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  );
};
