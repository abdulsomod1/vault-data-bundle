import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuth, createApiResponse, createErrorResponse } from '@/lib/api-helpers';

// POST /api/wallet/verify - Verify Paystack transaction
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return createErrorResponse('Reference is required', 400);
    }

    // Verify with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.status) {
      return createErrorResponse('Transaction verification failed', 400);
    }

    if (verifyData.data.status !== 'success') {
      // Update transaction status
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'failed' })
        .eq('reference', reference);

      return createErrorResponse('Transaction was not successful', 400);
    }

    const amount = verifyData.data.amount / 100; // Convert from kobo

    // Get current wallet balance
    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('balance')
      .eq('user_id', authResult.user.id)
      .single();

    const oldBalance = wallet?.balance || 0;
    const newBalance = oldBalance + amount;

    // Update wallet balance
    const { error: updateError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', authResult.user.id);

    if (updateError) {
      return createErrorResponse('Failed to update wallet', 500);
    }

    // Update transaction status
    await supabaseAdmin
      .from('transactions')
      .update({
        status: 'completed',
        balance_before: oldBalance,
        balance_after: newBalance,
      })
      .eq('reference', reference);

    // Create notification
    await supabaseAdmin.from('notifications').insert({
      user_id: authResult.user.id,
      title: 'Wallet Funded',
      message: `Your wallet has been credited with ₦${amount.toLocaleString()}`,
      type: 'success',
    });

    return createApiResponse({
      success: true,
      message: 'Wallet funded successfully',
      balance: newBalance,
    });
  } catch (error: any) {
    return createErrorResponse(error.message);
  }
}
