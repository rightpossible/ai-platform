import { NextRequest, NextResponse } from 'next/server';
import { fixUserRoles } from '@/lib/db/fix-user-roles';

export async function POST(request: NextRequest) {
  try {
    // Run role fix
    const result = await fixUserRoles();
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }

  } catch (error) {
    console.error('Fix roles error:', error);
    return NextResponse.json(
      { error: 'Failed to fix user roles' },
      { status: 500 }
    );
  }
}