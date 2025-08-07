import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { UserErpNextSite } from '@/lib/db/schemas/userErpNextSite';

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    // Delete all failed and suspended sites
    const deleteResult = await UserErpNextSite.deleteMany({
      status: { $in: ['failed', 'suspended'] }
    });

    console.log(`Deleted ${deleteResult.deletedCount} failed/suspended site records`);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deleteResult.deletedCount} failed/suspended site records`,
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    console.error('Error cleaning up failed sites:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Also allow for specific user cleanup
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await connectDB();

    // Delete user's failed and suspended sites
    const deleteResult = await UserErpNextSite.deleteMany({
      userId: user.id,
      status: { $in: ['failed', 'suspended'] }
    });

    console.log(`Deleted ${deleteResult.deletedCount} failed/suspended sites for user ${user.id}`);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deleteResult.deletedCount} failed/suspended sites for your account`,
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    console.error('Error cleaning up user failed sites:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
