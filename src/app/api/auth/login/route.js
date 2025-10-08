import { NextResponse } from 'next/server';
import { authenticateUser } from "@/lib/auth-service";

export async function POST(request) {
  try {
    console.log('POST /api/auth/login called');
    const { username, password } = await request.json();
    console.log('Login attempt:', { username });

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // 用户认证 - authenticateUser already handles everything
    const result = await authenticateUser({ username, password });

    return NextResponse.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}