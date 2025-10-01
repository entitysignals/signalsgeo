import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  const isAuthenticated = await checkAdminAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({ authenticated: true });
}

