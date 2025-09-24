import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { findUserByUsername, findUserByEmail, addUser } from '@/lib/mockDb';

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

    // Check for existing user using shared DB
    if (findUserByUsername(username)) {
      console.log('❌ Username already exists:', username);
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    if (findUserByEmail(email)) {
      console.log('❌ Email already registered:', email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user using shared DB
    const newUser = addUser({
      username,
      email,
      password, // Note: In production, hash the password
    });

    console.log('✅ New user created:', newUser.username);

    // Generate token
    const token = generateToken({
      username: newUser.username,
      email: newUser.email
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}