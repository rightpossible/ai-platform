import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { UserErpNextSite } from '@/lib/db/schemas/userErpNextSite';
import { deleteCustomerSite } from '@/lib/utils/erpnext-api';

export async function DELETE(request: NextRequest) {
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

    // Find user's site
    const userSite = await UserErpNextSite.findOne({ userId: user.id });
    
    if (!userSite) {
      return NextResponse.json({
        success: false,
        message: 'No site found to delete'
      });
    }

    console.log(`Deleting site for testing: ${userSite.username}`);

    // Delete from ERPNext backend
    try {
      const deleteResult = await deleteCustomerSite(userSite.username);
      console.log(`ERPNext backend deletion result:`, deleteResult);
      
      if (!deleteResult.success) {
        console.warn(`ERPNext backend deletion failed: ${deleteResult.error}`);
        // Log the warning but continue with database cleanup
        // This ensures we don't leave orphaned records in our DB
      }
    } catch (backendError) {
      console.error('Error deleting from ERPNext backend:', backendError);
      // Continue even if backend deletion fails - clean up our DB anyway
    }

    // Delete from our database
    await UserErpNextSite.findByIdAndDelete(userSite._id);

    console.log(`Successfully deleted site ${userSite.username} for user ${user.id}`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted site: ${userSite.username}`,
      deletedSite: {
        username: userSite.username,
        siteUrl: userSite.siteUrl
      },
      note: "Database record cleaned up. ERPNext backend deletion may have failed - check server logs."
    });

  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
