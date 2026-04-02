// User and Authentication Types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  phone_number?: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  is_active?: boolean;
  wallet_balance?: number;
  total_spent?: number;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  total_funded?: number;
  total_spent?: number;
  created_at: string;
  updated_at: string;
}

// Transaction Types
export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id?: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference?: string;
  description: string;
  payment_method?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type DataNetwork = 'mtn' | 'airtel' | 'glo' | '9mobile' | 'MTN' | 'Airtel' | 'Glo' | '9mobile';

export interface Order {
  id: string;
  user_id: string;
  network: DataNetwork;
  package_type?: 'data' | 'airtime';
  data_plan_id?: string;
  sim_id?: string;
  phone_number: string;
  amount: number;
  quantity?: number;
  status: OrderStatus;
  payment_status?: string;
  reference?: string;
  transaction_id?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// Data Plan Types
export interface DataPlan {
  id: string;
  network: DataNetwork;
  plan_name: string;
  name?: string;
  data_size?: string;
  price: number;
  amount?: number;
  validity_days?: number;
  validity?: string;
  package_type?: 'data' | 'airtime';
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// SIM Types
export interface Sim {
  id: string;
  network: DataNetwork;
  phone_number: string;
  identifier?: string;
  sim_name?: string;
  balance: number;
  total_used?: number;
  total_balance?: number;
  max_daily_limit?: number;
  is_active: boolean;
  assigned_to?: string;
  status?: 'active' | 'inactive' | 'depleted';
  created_at: string;
  updated_at?: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
  is_read?: boolean;
  action_url?: string;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_customers?: number;
  completed_orders: number;
  pending_orders: number;
  failed_orders: number;
  date?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface SignUpForm {
  email: string;
  password: string;
  confirm_password?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface FundWalletForm {
  amount: number;
  payment_method: 'paystack' | 'flutterwave';
}

export interface BuyDataForm {
  network: DataNetwork;
  data_plan_id: string;
  phone_number: string;
  amount: number;
}

// Payment Verification
export interface PaymentVerification {
  reference: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency?: string;
  timestamp?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Filter Types
export interface OrderFilters {
  network?: DataNetwork;
  status?: OrderStatus;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
}

// Auth Context
export interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
  sign_up: (data: SignUpForm) => Promise<void>;
  sign_in: (data: LoginForm) => Promise<void>;
  sign_out: () => Promise<void>;
  reset_password: (email: string) => Promise<void>;
  is_authenticated: boolean;
  is_admin: boolean;
}

// UI Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transaction_id?: string;
  reference?: string;
  sim_id?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

// SIM/Data Source Types
export interface SIMSource {
  id: string;
  network: 'MTN' | 'Airtel' | 'Glo' | '9mobile';
  source_type: 'sim' | 'sme_data' | 'vtu_api';
  identifier: string; // SIM number or API identifier
  balance: number;
  total_balance: number;
  status: 'active' | 'inactive' | 'depleted';
  created_at: string;
  updated_at: string;
  assigned_orders: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

// Product Types
export interface DataPlan {
  id: string;
  network: 'MTN' | 'Airtel' | 'Glo' | '9mobile';
  package_type: 'data' | 'airtime';
  name: string;
  amount: number;
  validity?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

// Admin Dashboard Stats
export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  total_users: number;
  daily_revenue: number;
}

// Authentication
export interface AuthResponse {
  user: User | null;
  session: any | null;
  error: string | null;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
