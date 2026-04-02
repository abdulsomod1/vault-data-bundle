import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuth, createApiResponse, createErrorResponse } from '@/lib/api-helpers';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || String(DEFAULT_PAGE_SIZE));
    const status = url.searchParams.get('status');
    const network = url.searchParams.get('network');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', authResult.user.id);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (network) {
      query = query.eq('network', network);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return createErrorResponse(error.message, 400);
    }

    return createApiResponse({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: to < (count || 0),
      },
    });
  } catch (error: any) {
    return createErrorResponse(error.message);
  }
}
