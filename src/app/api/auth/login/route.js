import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { findUserByUsername } from '@/lib/mockDb';

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

    // Find user using shared DB
    const user = findUserByUsername(username);
    console.log('User found:', user ? user.username : 'None');
    
    if (!user || user.password !== password) {
      console.log('❌ Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      username: user.username,
      email: user.email
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}