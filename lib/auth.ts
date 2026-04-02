import { supabase, supabaseAdmin } from './supabase';

/**
 * Sign up user
 */
export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (!authData.user) throw new Error('User creation failed');

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      role: 'user',
    });

    if (profileError) throw profileError;

    // Create wallet
    const { error: walletError } = await supabase.from('wallets').insert({
      user_id: authData.user.id,
      balance: 0,
      currency: 'NGN',
    });

    if (walletError) throw walletError;

    return { success: true, data: authData };
  } catch (error) {
    throw new Error(`Sign up failed: ${error}`);
  }
}

/**
 * Sign in user
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last login
    if (data.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    return { success: true, data };
  } catch (error) {
    throw new Error(`Sign in failed: ${error}`);
  }
}

/**
 * Sign out user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw new Error(`Sign out failed: ${error}`);
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw new Error(`Password reset failed: ${error}`);
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw new Error(`Password update failed: ${error}`);
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to get user profile: ${error}`);
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Record<string, any>
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error}`);
  }
}

/**
 * Create admin user (server-side only)
 */
export async function createAdminUser(email: string, password: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw error;

    if (data.user) {
      // Create admin profile
      await supabaseAdmin.from('users').insert({
        id: data.user.id,
        email,
        role: 'admin',
      });
    }

    return { success: true, data };
  } catch (error) {
    throw new Error(`Admin user creation failed: ${error}`);
  }
}

/**
 * Verify user email (server-side only)
 */
export async function verifyUserEmail(userId: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw new Error(`Email verification failed: ${error}`);
  }
}

import { User } from '@/types';
import { validateEmail, validatePassword } from './utils';

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName: string) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email address');
    }
    
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters with 1 uppercase letter and 1 number');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email address');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset password
  async resetPassword(email: string) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email address');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    if (!validatePassword(newPassword)) {
      throw new Error('Password must be at least 8 characters with 1 uppercase letter and 1 number');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    // Fetch user profile from database
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile || null;
  },

  // Get session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: User | null, session: any | null) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user, session);
      } else {
        callback(null, null);
      }
    });

    return subscription;
  },

  // Update profile
  async updateProfile(data: Partial<User>) {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
  },
};
