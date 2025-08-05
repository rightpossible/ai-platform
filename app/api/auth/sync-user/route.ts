import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { syncAuth0User } from '@/lib/auth/user-sync';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No user session found' }, { status: 401 });
    }

    const result = await syncAuth0User(session.user);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'User synced successfully',
        user: result.user
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in sync-user API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No user session found' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: session.user
    });
  } catch (error) {
    console.error('Error getting user session:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}