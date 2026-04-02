import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuth, createApiResponse, createErrorResponse } from '@/lib/api-helpers';

// GET /api/admin/stats
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    // Check if user is admin
    if (authResult.user.role !== 'admin') {
      return createErrorResponse('Unauthorized', 403);
    }

    // Get total revenue (sum of all completed transactions)
    const { data: revenueData } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('type', 'debit')
      .eq('status', 'completed');

    const totalRevenue = revenueData?.reduce((sum, t) => sum + t.amount, 0) || 0;

    // Get today's revenue
    const today = new Date().toISOString().split('T')[0];
    const { data: todayData } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('type', 'debit')
      .eq('status', 'completed')
      .gte('created_at', today);

    const dailyRevenue = todayData?.reduce((sum, t) => sum + t.amount, 0) || 0;

    // Get order stats
    const { count: totalOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' });

    const { count: completedOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('status', 'completed');

    const { count: pendingOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('status', 'pending');

    // Get total users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'user');

    return createApiResponse({
      total_revenue: totalRevenue,
      daily_revenue: dailyRevenue,
      total_orders: totalOrders || 0,
      completed_orders: completedOrders || 0,
      pending_orders: pendingOrders || 0,
      total_users: totalUsers || 0,
    });
  } catch (error: any) {
    return createErrorResponse(error.message);
  }
}
