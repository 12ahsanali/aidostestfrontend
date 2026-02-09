import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  console.log("Proxy checking path:", pathname);
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup'];
  const apiRoutes = ['/api/auth/login', '/api/auth/signup', '/api/auth/logout', '/api/auth/check'];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // Check if the current path is an API route
  const isApiRoute = apiRoutes.some(route => 
    pathname.startsWith(route)
  );

  console.log("Is public route:", isPublicRoute, "Is API route:", isApiRoute);

  // If it's an API route, allow access
  if (isApiRoute) {
    console.log("Allowing access to API route");
    return NextResponse.next();
  }

  // Check for token cookie
  const token = request.cookies.get('token')?.value;
  console.log("Token found:", !!token);

  // If user has token and is trying to access login/signup, redirect to dashboard
  if (isPublicRoute && token) {
    console.log("User is authenticated, redirecting from", pathname, "to dashboard /");
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If it's a public route and no token, allow access
  if (isPublicRoute) {
    console.log("Allowing access to public route");
    return NextResponse.next();
  }

  // For protected routes, check for token
  if (!token) {
    console.log("No token found, redirecting to login");
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  console.log("Token valid, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|css|js|ico|txt|woff|woff2)).*)',
  ],
};
