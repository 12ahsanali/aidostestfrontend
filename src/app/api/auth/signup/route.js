import { NextResponse } from 'next/server';

// Mock user database (in production, use a real database)
let users = [
  {
    id: 1,
    email: 'admin@aiodas.com',
    password: 'admin123', // In production, this should be hashed
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'user@aiodas.com',
    password: 'user123',
    name: 'Regular User'
  }
];

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user (in production, hash the password)
    const newUser = {
      id: users.length + 1,
      email,
      password, // In production, this should be hashed
      name: name || email.split('@')[0] // Use name or extract from email
    };

    users.push(newUser);

    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${newUser.id}:${newUser.email}:${Date.now()}`).toString('base64');

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Signup successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
