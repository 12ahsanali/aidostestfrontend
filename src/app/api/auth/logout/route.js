import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0 // Immediately expire
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
