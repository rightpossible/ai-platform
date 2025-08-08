import { NextRequest, NextResponse } from 'next/server';
import { validateAndMarkTokenUsed } from '@/lib/sso/validation';
import { connectDB } from '@/lib/db/connection';
import { App } from '@/lib/db/schemas/app';

export async function POST(request: NextRequest) {
  try {
    // Check API key authentication
    const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!apiKey) {
      return NextResponse.json({ 
        valid: false, 
        error: 'API key required' 
      }, { status: 401 });
    }

    // Validate API key by finding the app
    await connectDB();
    const app = await App.findOne({ apiKey, status: 'active' });
    if (!app) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid API key' 
      }, { status: 401 });
    }

    // Parse request body
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Token is required' 
      }, { status: 400 });
    }

    // Validate token and mark as used
    const result = await validateAndMarkTokenUsed(token);
    
    if (result.valid) {
      return NextResponse.json({
        valid: true,
        payload: result.payload
      });
    } else {
      return NextResponse.json({
        valid: false,
        error: result.error
      }, { status: 401 });
    }

  } catch (error) {
    console.error('SSO validation API error:', error);
    return NextResponse.json({
      valid: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Optional: GET endpoint for debugging
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'SSO Validation Endpoint',
    usage: 'POST with { "token": "jwt_token_here" }'
  });
}
