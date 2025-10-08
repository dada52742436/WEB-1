import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { createUser } from "@/lib/auth-service";

export async function POST(request) {
  try {
    console.log('POST /api/auth/register called');
    const { username, email, password } = await request.json();
    console.log('Registration attempt:', { username, email });

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create user - createUser already checks for existing users
    const newUser = await createUser({
      username,
      email,
      password,
    });

    console.log('✅ New user created:', newUser.username);

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email
    });

    return NextResponse.json({
      message: 'Registration successful',
      user: newUser,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Return specific error message from createUser
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}