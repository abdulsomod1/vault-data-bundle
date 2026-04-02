import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Generate unique order reference
export function generateOrderReference(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// API Response helpers
export function createApiResponse(data: any, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function createErrorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message, data: null },
    { status }
  );
}

// Verify authentication token
export async function verifyAuth(request: any) {
  try {
    const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!authHeader) {
      return { error: 'Unauthorized', status: 401 };
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(authHeader);

    if (error || !user) {
      return { error: 'Invalid token', status: 401 };
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { error: 'User profile not found', status: 404 };
    }

    return { user, profile: userProfile, error: null };
  } catch (error) {
    return { error: 'Auth verification failed', status: 500 };
  }
}

// Verify admin role
export async function verifyAdmin(request: any) {
  const { user, profile, error, status } = await verifyAuth(request);

  if (error) {
    return { error, status };
  }

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden: Admin access required', status: 403 };
  }

  return { user, profile, error: null };
}

// Get user wallet
export async function getUserWallet(userId: string) {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to get wallet: ${error.message}`);
  }
}

// Get wallet transactions
export async function getWalletTransactions(
  userId: string,
  limit = 50,
  offset = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  } catch (error: any) {
    throw new Error(`Failed to get transactions: ${error.message}`);
  }
}

// Create transaction
export async function createTransaction(
  userId: string,
  walletId: string,
  type: 'credit' | 'debit',
  amount: number,
  description: string,
  reference?: string,
  metadata?: Record<string, any>
) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        wallet_id: walletId,
        type,
        amount,
        description,
        reference: reference || generateOrderReference(),
        status: 'pending',
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
}

// Update transaction status
export async function updateTransactionStatus(
  transactionId: string,
  status: 'completed' | 'pending' | 'failed' | 'refunded'
) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
}

// Get transaction by reference
export async function getTransactionByReference(reference: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return null;
  }
}

// Get data plans
export async function getDataPlans(network?: string) {
  try {
    let query = supabase
      .from('data_plans')
      .select('*')
      .eq('is_active', true);

    if (network) {
      query = query.eq('network', network);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to get data plans: ${error.message}`);
  }
}

// Create order
export async function createOrder(
  userId: string,
  network: string,
  phoneNumber: string,
  amount: number,
  packageType: string = 'data',
  metadata?: Record<string, any>
) {
  try {
    const reference = generateOrderReference();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        network,
        phone_number: phoneNumber,
        amount,
        package_type: packageType,
        status: 'pending',
        reference,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
}

// Get user orders
export async function getUserOrders(userId: string, limit = 50, offset = 0) {
  try {
    const { data, error, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  } catch (error: any) {
    throw new Error(`Failed to get orders: ${error.message}`);
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to get order: ${error.message}`);
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed'
) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
}

// Create notification
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type = 'info'
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

// Get user notifications
export async function getUserNotifications(userId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to get notifications: ${error.message}`);
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
}

// Get all orders (admin only)
export async function getAllOrders(
  limit = 50,
  offset = 0,
  filters?: {
    network?: string;
    status?: string;
    userId?: string;
  }
) {
  try {
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });

    if (filters?.network) {
      query = query.eq('network', filters.network);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  } catch (error: any) {
    throw new Error(`Failed to get orders: ${error.message}`);
  }
}

// Get SIM sources
export async function getSimSources(network?: string) {
  try {
    let query = supabase
      .from('sim_sources')
      .select('*')
      .eq('status', 'active');

    if (network) {
      query = query.eq('network', network);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to get SIM sources: ${error.message}`);
  }
}

// Update wallet balance
export async function updateWalletBalance(
  walletId: string,
  amount: number,
  isCredit: boolean
) {
  try {
    const { data, error } = await supabase
      .rpc('update_wallet_balance', {
        wallet_id: walletId,
        amount: isCredit ? amount : -amount,
      });

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update wallet balance: ${error.message}`);
  }
}

// Get admin dashboard stats
export async function getAdminStats() {
  try {
    // Get today's orders
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
