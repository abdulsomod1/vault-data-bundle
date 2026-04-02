import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Generate unique order reference
function generateOrderReference(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// API Response helpers
export function createApiResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Middleware to verify auth
export async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { error: 'Unauthorized', status: 401 };
    }

    const token = authHeader.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return { error: 'Invalid token', status: 401 };
    }

    // Get user profile
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return { user: data.user, profile: userProfile, error: null };
  } catch (error) {
    return { error: 'Auth verification failed', status: 500 };
  }
}

// Verify admin role
export async function verifyAdmin(request: NextRequest) {
  const { user, profile, error, status } = await verifyAuth(request);

  if (error) {
    return { error, status };
  }

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden', status: 403 };
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
  } catch (error) {
    throw new Error(`Failed to get wallet: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to get transactions: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to create transaction: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to update transaction: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to get data plans: ${error}`);
  }
}

// Create order
export async function createOrder(
  userId: string,
  network: string,
  phoneNumber: string,
  dataPlanId: string,
  amount: number,
  metadata?: Record<string, any>
) {
  try {
    const reference = generateOrderReference();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        data_plan_id: dataPlanId,
        network,
        phone_number: phoneNumber,
        amount,
        status: 'pending',
        reference,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to create order: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to get orders: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to get order: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to update order: ${error}`);
  }
}

// Create notification
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type = 'info',
  actionUrl?: string
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
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
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to get notifications: ${error}`);
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error}`);
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
    let query = supabase.from('orders').select('*', { count: 'exact' });

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
  } catch (error) {
    throw new Error(`Failed to get orders: ${error}`);
  }
}

// Get SIMs
export async function getSims(network?: string) {
  try {
    let query = supabase.from('sims').select('*').eq('is_active', true);

    if (network) {
      query = query.eq('network', network);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to get SIMs: ${error}`);
  }
}

// Get dashboard stats (admin only)
export async function getDashboardStats(date?: string) {
  try {
    const queryDate = date || new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('date', queryDate)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data || {
      total_revenue: 0,
      total_orders: 0,
      total_customers: 0,
      completed_orders: 0,
      pending_orders: 0,
      failed_orders: 0,
    };
  } catch (error) {
    throw new Error(`Failed to get dashboard stats: ${error}`);
  }
}
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return { user: userProfile, token };
  } catch (error) {
    return { error: 'Unauthorized', status: 401 };
  }
}

// Protected route wrapper
export function createApiResponse(data?: any, error?: string, status = 200) {
  if (error) {
    return NextResponse.json(
      { success: false, error, data: null },
      { status: status || 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status });
}

// Error response
export function createErrorResponse(message: string, status = 500) {
  return NextResponse.json(
    { success: false, error: message, data: null },
    { status }
  );
}
