import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuth, createApiResponse, createErrorResponse } from '@/lib/api-helpers';
import { generateReference } from '@/lib/utils';

// POST /api/orders/create
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return createErrorResponse(authResult.error, authResult.status);
    }

    const body = await request.json();
    const { network, packageType, amount, phoneNumber } = body;

    // Validate inputs
    if (!network || !packageType || !amount || !phoneNumber) {
      return createErrorResponse('Missing required fields', 400);
    }

    const validNetworks = ['MTN', 'Airtel', 'Glo', '9mobile'];
    if (!validNetworks.includes(network)) {
      return createErrorResponse('Invalid network', 400);
    }

    if (!['data', 'airtime'].includes(packageType)) {
      return createErrorResponse('Invalid package type', 400);
    }

    // Check wallet balance
    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('balance')
      .eq('user_id', authResult.user.id)
      .single();

    if (!wallet || wallet.balance < amount) {
      return createErrorResponse('Insufficient wallet balance', 400);
    }

    // Create order
    const reference = generateReference();
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: authResult.user.id,
        network,
        package_type: packageType,
        amount,
        phone_number: phoneNumber,
        reference,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return createErrorResponse(error.message, 400);
    }

    // Deduct from wallet
    const newBalance = wallet.balance - amount;
    await supabaseAdmin
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', authResult.user.id);

    // Create transaction record
    await supabaseAdmin.from('transactions').insert({
      user_id: authResult.user.id,
      type: 'debit',
      amount,
      balance_before: wallet.balance,
      balance_after: newBalance,
      reference,
      description: `${packageType === 'data' ? 'Data' : 'Airtime'} purchase - ${network}`,
      status: 'completed',
    });

    // Create notification
    await supabaseAdmin.from('notifications').insert({
      user_id: authResult.user.id,
      title: 'Order Created',
      message: `Your ${packageType} order has been created. Reference: ${reference}`,
      type: 'info',
    });

    return createApiResponse(order, undefined, 201);
  } catch (error: any) {
    return createErrorResponse(error.message);
  }
}
