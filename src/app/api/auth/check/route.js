import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Decode the token (in production, use JWT verification)
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId, userEmail, timestamp] = decoded.split(':');
      
      // Check if token is not too old (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return NextResponse.json(
          { success: false, message: 'Token expired' },
          { status: 401 }
        );
      }

      // Mock user data
      const user = {
        id: parseInt(userId),
        email: userEmail,
        name: userEmail === 'admin@aiodas.com' ? 'Admin User' : 'Regular User'
      };

      return NextResponse.json({
        success: true,
        user
      });
    } catch (decodeError) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
