import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
// import { findUserByUsername } from '@/lib/mockDb';
import { verifySession } from "@/lib/auth-service";
/**
 * GET /api/auth/me
 * Returns current user information based on JWT token
 */
export async function GET(request) {
  try {
    console.log('🔐 GET /api/auth/me called');
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ No Bearer token found');
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify the JWT token
    // const decoded = verifyToken(token);
    
    // if (!decoded) {
    //   console.log('❌ Token verification failed');
    //   return NextResponse.json(
    //     { error: 'Invalid or expired token' },
    //     { status: 401 }
    //   );
    // }

    const user = await verifySession(token);

    return NextResponse.json({
      user,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("会话验证错误:", error);

    return NextResponse.json(
      { error: error.message || "会话无效" },
      { status: 401 }
    );
  }


    // Find user by username using shared DB
  //   console.log('👤 Looking for user:', decoded.username);
  //   const user = await findUserByUsername(decoded.username);
  //   console.log('✅ Found user:', user ? user.username : 'None');
    
  //   if (!user) {
  //     console.log('❌ User not found in database');
  //     return NextResponse.json(
  //       { error: 'User not found' },
  //       { status: 404 }
  //     );
  //   }

  //   // Remove password from response
  //   const { password: _, ...userWithoutPassword } = user;
  //   console.log('✅ Returning user data for:', userWithoutPassword.username);

  //   return NextResponse.json({ 
  //     user: userWithoutPassword 
  //   });

  // } catch (error) {
  //   console.error('💥 Error in /api/auth/me:', error);
  //   return NextResponse.json(
  //     { error: 'Internal server error' },
  //     { status: 500 }
  //   );
  // }
}