'use server';

import { supabase } from './supabase';

// ============================================
// RESPONSE HELPERS
// ============================================

export function createApiResponse(data: any, message: string = 'Success', status: number = 200) {
  return {
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(error: any, message: string = 'Error', status: number = 500) {
  console.error(`[API Error] ${message}:`, error);
  return {
    status,
    message,
    error: error?.message || String(error),
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// ORDER HELPERS
// ============================================

/**
 * Generate unique order reference
 */
export function generateOrderReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Create a new order
 */
export async function createOrder(orderData: {
  user_id: string;
  network: string;
  package_type: string;
  amount: number;
  phone_number: string;
  quantity?: number;
}) {
  try {
    const reference = generateOrderReference();

    const { data, error } = await supabase.from('orders').insert({
      ...orderData,
      reference,
      status: 'pending',
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new Error(`Failed to get user orders: ${error.message}`);
  }
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(filters?: { status?: string; network?: string; userId?: string }) {
  try {
    let query = supabase.from('orders').select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.network) {
      query = query.eq('network', filters.network);
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new Error(`Failed to get orders: ${error.message}`);
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }
}

// ============================================
// WALLET HELPERS
// ============================================

/**
 * Create wallet for user
 */
export async function createWallet(userId: string) {
  try {
    const { data, error } = await supabase.from('wallets').insert({
      user_id: userId,
      balance: 0,
      total_funded: 0,
      total_spent: 0,
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to create wallet: ${error.message}`);
  }
}

/**
 * Get wallet by user ID
 */
export async function getWallet(userId: string) {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to get wallet: ${error.message}`);
  }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(userId: string) {
  try {
    const wallet = await getWallet(userId);
    return wallet?.balance || 0;
  } catch (error: any) {
    throw new Error(`Failed to get wallet balance: ${error.message}`);
  }
}

/**
 * Add transaction
 */
export async function addTransaction(transactionData: {
  user_id: string;
  wallet_id: string;
  type: string;
  amount: number;
  description: string;
  reference?: string;
  payment_method?: string;
}) {
  try {
    const { data, error } = await supabase.from('transactions').insert(transactionData);

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to add transaction: ${error.message}`);
  }
}

/**
 * Get transactions for user
 */
export async function getUserTransactions(userId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new Error(`Failed to get transactions: ${error.message}`);
  }
}

// ============================================
// DATA PLANS
// ============================================

/**
 * Get all active data plans
 */
export async function getDataPlans(network?: string) {
  try {
    let query = supabase.from('data_plans').select('*').eq('is_active', true);

    if (network) {
      query = query.eq('network', network);
    }

    const { data, error } = await query.order('amount', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new Error(`Failed to get data plans: ${error.message}`);
  }
}

/**
 * Create data plan (admin only)
 */
export async function createDataPlan(planData: {
  network: string;
  package_type: string;
  name: string;
  amount: number;
  validity?: string;
  description?: string;
}) {
  try {
    const { data, error } = await supabase.from('data_plans').insert(planData);

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to create data plan: ${error.message}`);
  }
}

// ============================================
// SIM/DATA SOURCES
// ============================================

/**
 * Get SIM sources with filters
 */
export async function getSimSources(network?: string, status?: string) {
  try {
    let query = supabase.from('sim_sources').select('*');

    if (network) {
      query = query.eq('network', network);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new Error(`Failed to get SIM sources: ${error.message}`);
  }
}

/**
 * Create SIM source (admin only)
 */
export async function createSimSource(simData: {
  network: string;
  source_type: string;
  identifier: string;
  balance: number;
  total_balance: number;
}) {
  try {
    const { data, error } = await supabase.from('sim_sources').insert(simData);

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to create SIM source: ${error.message}`);
  }
}

/**
 * Update SIM balance
 */
export async function updateSimBalance(simId: string, newBalance: number) {
  try {
    const { data, error } = await supabase
      .from('sim_sources')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', simId);

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update SIM balance: ${error.message}`);
  }
}

// ============================================
// USER HELPERS
// =============================================

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: { first_name?: string; last_name?: string; phone_number?: string; avatar_url?: string }
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
}

/**
 * Get admin dashboard stats
 */
export async function getAdminStats() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .gte('created_at', `${today}T00:00:00`);

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'user');

    const { data: transactions, error: txnError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'completed')
      .eq('type', 'credit')
      .gte('created_at', `${today}T00:00:00`);

    if (ordersError || usersError || txnError) {
      throw new Error('Failed to fetch stats');
    }

    const totalRevenue = transactions?.reduce((sum: number, txn: any) => sum + txn.amount, 0) || 0;

    return {
      total_revenue: totalRevenue,
      total_orders: orders?.length || 0,
      total_users: users?.length || 0,
      today_orders: orders?.filter((o: any) => o.status === 'completed').length || 0,
    };
  } catch (error: any) {
    throw new Error(`Failed to get admin stats: ${error.message}`);
  }
}
