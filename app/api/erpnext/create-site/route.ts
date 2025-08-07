import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { UserErpNextSite } from '@/lib/db/schemas/userErpNextSite';
import { generateUniqueUsername, generateSiteUrl } from '@/lib/utils/username-generator';
import { createCustomerSite, checkSiteExists, deleteCustomerSite } from '@/lib/utils/erpnext-api';

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

    // Check if user already has an ERPNext site
    const existingSite = await UserErpNextSite.findOne({ userId: user.id });
    if (existingSite) {
      if (existingSite.status === 'active') {
        return NextResponse.json({
          success: true,
          site: {
            siteUrl: existingSite.siteUrl,
            username: 'Administrator',
            status: existingSite.status,
            adminPassword: existingSite.adminPassword
          }
        });
      } else if (existingSite.status === 'creating') {
        return NextResponse.json({
          success: false,
          error: 'Site creation already in progress'
        }, { status: 409 });
      }
    }

    // Parse request body
    const { password } = await request.json();
    
    if (!password || password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Generate unique username - ensure no collisions
    let username: string;
    let siteUrl: string;
    
    try {
      username = await generateUniqueUsername({ 
        userId: user.id,
        maxAttempts: 10 
      });
      siteUrl = generateSiteUrl(username);
    } catch (usernameError) {
      return NextResponse.json({
        success: false,
        error: 'Unable to generate unique username. Please try again.'
      }, { status: 500 });
    }

    // Call ERPNext site creation API first (don't save anything until success)
    console.log(`Attempting to create ERPNext site for user ${user.id} with username ${username}`);
    
    try {
      const erpnextResult = await createCustomerSite(username, user.email, password);

      if (erpnextResult.success) {
        // Double-check that the site was actually created by verifying with check-site API
        let actualSiteUrl = erpnextResult.data.site_url || siteUrl;
        
        try {
          const verifyResult = await checkSiteExists(username);
          
          if (!verifyResult.success || !verifyResult.exists) {
            console.error(`Site creation reported success but verification failed for ${username}`);
            // Don't save anything to database if verification fails
            return NextResponse.json({
              success: false,
              error: 'Site creation verification failed. Please try again.'
            }, { status: 500 });
          } else {
            actualSiteUrl = verifyResult.data?.site_url || actualSiteUrl;
            console.log(`Site creation verified successfully for ${username}`);
          }
        } catch (verifyError) {
          console.error('Error verifying site creation:', verifyError);
          // If we can't verify, don't save to database
          return NextResponse.json({
            success: false,
            error: 'Unable to verify site creation. Please try again.'
          }, { status: 500 });
        }

        // Only save to database if ERPNext creation AND verification both succeed
        const userSite = new UserErpNextSite({
          userId: user.id,
          username,
          siteUrl: actualSiteUrl,
          adminPassword: password,
          email: user.email,
          status: 'active'
        });

        try {
          await userSite.save();
        } catch (saveError: any) {
          // Handle duplicate key errors - this shouldn't happen but just in case
          if (saveError.code === 11000) {
            if (saveError.message.includes('username')) {
              // Site was created on ERPNext but username conflict in DB
              // Clean up ERPNext site
              await deleteCustomerSite(username);
              return NextResponse.json({
                success: false,
                error: 'Username conflict. Please try again with a different configuration.'
              }, { status: 409 });
            } else if (saveError.message.includes('one_active_site_per_user')) {
              // User already has a site - clean up the new one
              await deleteCustomerSite(username);
              return NextResponse.json({
                success: false,
                error: 'You already have an active ERPNext site.'
              }, { status: 409 });
            }
          }
          
          console.error('Error saving user site:', saveError);
          // Clean up ERPNext site since we couldn't save to DB
          await deleteCustomerSite(username);
          return NextResponse.json({
            success: false,
            error: 'Database error. Please try again.'
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          site: {
            siteUrl: actualSiteUrl,
            username: 'Administrator',
            status: 'active',
            adminPassword: password
          }
        });
      } else {
        // ERPNext creation failed - don't save anything to database
        console.log(`ERPNext site creation failed for ${username}: ${erpnextResult.error}`);
        return NextResponse.json({
          success: false,
          error: erpnextResult.error || 'Failed to create ERPNext site'
        }, { status: 500 });
      }

    } catch (erpnextError) {
      console.error('ERPNext API Error:', erpnextError);
      
      // Don't save anything to database on error
      if (erpnextError instanceof Error && erpnextError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: 'Site creation is taking longer than expected. Please try again in a few minutes.',
          isTimeout: true
        }, { status: 408 });
      }

      return NextResponse.json({
        success: false,
        error: 'Service is currently unavailable. Please try again later.'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('Error creating ERPNext site:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Get user's ERPNext site status
export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await connectDB();

    const userSite = await UserErpNextSite.findOne({ userId: user.id });
    
    if (!userSite) {
      return NextResponse.json({
        success: false,
        hasSite: false
      });
    }

    // Auto-cleanup any failed or suspended sites (shouldn't exist with new logic)
    if (userSite.status === 'failed' || userSite.status === 'suspended') {
      console.log(`Auto-cleaning up ${userSite.status} site for user ${user.id}`);
      await UserErpNextSite.findByIdAndDelete(userSite._id);
      return NextResponse.json({
        success: false,
        hasSite: false
      });
    }

    // Cross-check with ERPNext backend to ensure site actually exists
    try {
      const checkResult = await checkSiteExists(userSite.username);
      
      if (checkResult.success && !checkResult.exists) {
        // Site doesn't exist on ERPNext backend, but exists in our DB
        // This shouldn't happen with new logic, but clean up if it does
        console.log(`Site ${userSite.username} exists in DB but not on ERPNext backend, cleaning up`);
        
        // Delete the inconsistent record
        await UserErpNextSite.findByIdAndDelete(userSite._id);
        
        return NextResponse.json({
          success: false,
          hasSite: false
        });
      }
    } catch (checkError) {
      console.error('Error checking site with ERPNext backend:', checkError);
      // Continue with database status if backend check fails
    }

    return NextResponse.json({
      success: true,
      hasSite: true,
      site: {
        siteUrl: userSite.siteUrl,
        status: userSite.status,
        username: 'Administrator',
        adminPassword: userSite.adminPassword
      }
    });

  } catch (error) {
    console.error('Error fetching ERPNext site:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
