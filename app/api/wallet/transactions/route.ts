import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuth, createApiResponse, createErrorResponse } from '@/lib/api-helpers';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

// GET /api/wallet/transactions
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || String(DEFAULT_PAGE_SIZE));

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get transactions
    const { data, error, count } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', authResult.user.id)
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
