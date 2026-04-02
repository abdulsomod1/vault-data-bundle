import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuth, createApiResponse, createErrorResponse } from '@/lib/api-helpers';

// GET /api/wallet/balance
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    const { data, error } = await supabaseAdmin
      .from('wallets')
      .select('balance, currency')
      .eq('user_id', authResult.user.id)
      .single();

    if (error) {
      return createErrorResponse('Wallet not found', 404);
    }

    return createApiResponse(data);
  } catch (error: any) {
    return createErrorResponse(error.message);
  }
}
