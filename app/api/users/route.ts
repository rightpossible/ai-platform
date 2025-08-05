import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/schemas/user';

export async function GET() {
  try {
    await connectDB();
    
    const users = await User.find({}, {
      passwordHash: 0 // Exclude password hash from response
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        auth0Id: user.auth0Id,
        picture: user.picture,
        emailVerified: user.emailVerified,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}