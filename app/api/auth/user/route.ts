import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/api-helpers';

/**
 * GET /api/auth/user - Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    const { user, profile, error, status } = await verifyAuth(request);

    if (error) {
      return NextResponse.json({ error }, { status: status || 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user?.id,
        email: user?.email,
        ...profile,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/user - Update current user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const { user, profile, error, status } = await verifyAuth(request);

    if (error) {
      return NextResponse.json({ error }, { status: status || 401 });
    }

    const body = await request.json();
    const { first_name, last_name, phone_number, avatar_url } = body;

    const { error: updateError } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        phone_number,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
