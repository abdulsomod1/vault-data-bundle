import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyAuth, createTransaction, getUserWallet } from '@/lib/api-helpers';
import { initializePaystackPayment, generateTransactionReference } from '@/lib/payment';

/**
 * POST /api/wallet/fund - Initiate wallet funding
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error, status } = await verifyAuth(request);

    if (error) {
      return NextResponse.json({ error }, { status: status || 401 });
    }

    const body = await request.json();
    const { amount } = body;

    // Validate amount
    if (!amount || amount < 100 || amount > 500000) {
      return createErrorResponse('Invalid amount (Min: ₦100, Max: ₦500,000)', 400);
    }

    // Generate reference
    const reference = `VD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: authResult.user.email,
        amount: amount * 100, // Paystack uses kobo
        reference,
        metadata: {
          user_id: authResult.user.id,
          name: authResult.user.full_name,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return createErrorResponse('Failed to initiate payment', 400);
    }

    // Store transaction record (pending)
    await supabaseAdmin.from('transactions').insert({
      user_id: authResult.user.id,
      type: 'credit',
      amount,
      reference,
      description: 'Wallet funding',
      status: 'pending',
    });

    return createApiResponse({
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference,
    });
  } catch (error: any) {
    return createErrorResponse(error.message);
  }
}
