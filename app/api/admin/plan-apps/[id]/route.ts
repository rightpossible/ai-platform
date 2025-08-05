import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { PlanApp } from '@/lib/db/schemas/planApp';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Platform admin access required' }, { status: 403 });
    }

    await connectDB();

    const planApp = await PlanApp.findByIdAndDelete(params.id);
    if (!planApp) {
      return NextResponse.json({ error: 'Plan-app relationship not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'App removed from plan successfully'
    });

  } catch (error) {
    console.error('Error deleting plan-app relationship:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete plan-app relationship'
    }, { status: 500 });
  }
}