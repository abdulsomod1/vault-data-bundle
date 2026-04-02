// Networks
export const NETWORKS = {
  MTN: { name: 'MTN', code: 'mtn', color: '#ffd700' },
  AIRTEL: { name: 'Airtel', code: 'airtel', color: '#ff0000' },
  GLO: { name: 'Glo', code: 'glo', color: '#008000' },
  '9MOBILE': { name: '9mobile', code: '9mobile', color: '#ff6b00' },
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Transaction Type
export const TRANSACTION_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
};

// Package Type
export const PACKAGE_TYPES = {
  DATA: 'data',
  AIRTIME: 'airtime',
};

// Currency
export const CURRENCY = 'NGN';
export const CURRENCY_SYMBOL = '₦';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_LIMIT = 20;

// Min/Max amounts
export const MIN_WALLET_FUNDING = 100;
export const MAX_WALLET_FUNDING = 500000;
export const MIN_DATA_AMOUNT = 50;
export const MAX_DATA_AMOUNT = 100000;

// App name and URLs
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'VAULT DATA';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// API timeouts
export const API_TIMEOUT = 10000;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'vault_auth_token',
  USER: 'vault_user',
  THEME: 'vault_theme',
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Default data plans
export const DEFAULT_DATA_PLANS = [
  { network: 'MTN', name: '100MB', amount: 50, validity: '2 hours' },
  { network: 'MTN', name: '200MB', amount: 100, validity: '7 days' },
  { network: 'MTN', name: '500MB', amount: 200, validity: '7 days' },
  { network: 'MTN', name: '1GB', amount: 350, validity: '7 days' },
  { network: 'MTN', name: '2GB', amount: 650, validity: '7 days' },
  { network: 'MTN', name: '5GB', amount: 1500, validity: '30 days' },
  
  { network: 'Airtel', name: '100MB', amount: 50, validity: '2 hours' },
  { network: 'Airtel', name: '200MB', amount: 100, validity: '7 days' },
  { network: 'Airtel', name: '500MB', amount: 200, validity: '7 days' },
  { network: 'Airtel', name: '1GB', amount: 350, validity: '7 days' },
  { network: 'Airtel', name: '5GB', amount: 1500, validity: '30 days' },
  
  { network: 'Glo', name: '100MB', amount: 40, validity: '2 hours' },
  { network: 'Glo', name: '200MB', amount: 80, validity: '7 days' },
  { network: 'Glo', name: '500MB', amount: 180, validity: '7 days' },
  { network: 'Glo', name: '1GB', amount: 320, validity: '7 days' },
  { network: 'Glo', name: '5GB', amount: 1400, validity: '30 days' },
  
  { network: '9mobile', name: '100MB', amount: 50, validity: '2 hours' },
  { network: '9mobile', name: '200MB', amount: 100, validity: '7 days' },
  { network: '9mobile', name: '500MB', amount: 200, validity: '7 days' },
  { network: '9mobile', name: '1GB', amount: 350, validity: '7 days' },
  { network: '9mobile', name: '5GB', amount: 1500, validity: '30 days' },
];

// Airtime plans
export const DEFAULT_AIRTIME_PLANS = [
  { network: 'MTN', name: '100', amount: 100 },
  { network: 'MTN', name: '200', amount: 200 },
  { network: 'MTN', name: '500', amount: 500 },
  { network: 'MTN', name: '1000', amount: 1000 },
  
  { network: 'Airtel', name: '100', amount: 100 },
  { network: 'Airtel', name: '200', amount: 200 },
  { network: 'Airtel', name: '500', amount: 500 },
  { network: 'Airtel', name: '1000', amount: 1000 },
  
  { network: 'Glo', name: '100', amount: 100 },
  { network: 'Glo', name: '200', amount: 200 },
  { network: 'Glo', name: '500', amount: 500 },
  { network: 'Glo', name: '1000', amount: 1000 },
  
  { network: '9mobile', name: '100', amount: 100 },
  { network: '9mobile', name: '200', amount: 200 },
  { network: '9mobile', name: '500', amount: 500 },
  { network: '9mobile', name: '1000', amount: 1000 },
];
