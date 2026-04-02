import axios from 'axios';

// Payment verification types
export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    paid_at: string;
    customer: {
      email: string;
      customer_code: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      should_reuse?: boolean;
      account_number?: string;
    };
  };
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    status: string;
    failure_reason: null | string;
    customer: {
      id: number;
      email: string;
      phone_number: string;
      name: string;
    };
    created_at: string;
  };
}

/**
 * Verify Paystack payment
 */
export async function verifyPaystackPayment(reference: string): Promise<PaystackResponse> {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Paystack verification failed: ${error}`);
  }
}

/**
 * Initialize Paystack payment
 */
export async function initializePaystackPayment(
  email: string,
  amount: number,
  reference: string,
  metadata?: Record<string, any>
) {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Paystack initialization failed: ${error}`);
  }
}

/**
 * Verify Flutterwave payment
 */
export async function verifyFlutterwavePayment(
  transactionId: string
): Promise<FlutterwaveResponse> {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Flutterwave verification failed: ${error}`);
  }
}

/**
 * Initialize Flutterwave payment
 */
export async function initializeFlutterwavePayment(
  email: string,
  phone_number: string,
  amount: number,
  tx_ref: string,
  full_name: string
) {
  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref,
        amount,
        currency: 'NGN',
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet`,
        meta: {
          consumer_id: email,
          consumer_mac: phone_number,
        },
        customer: {
          email,
          phonenumber: phone_number,
          name: full_name,
        },
        customizations: {
          title: 'VAULT DATA',
          description: 'Fund Your Wallet',
          logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Flutterwave initialization failed: ${error}`);
  }
}

/**
 * Create transaction reference
 */
export function generateTransactionReference(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate order reference
 */
export function generateOrderReference(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
