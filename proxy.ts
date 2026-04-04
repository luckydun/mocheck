import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-2026';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // No token → force login
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const role = decoded.role || 'EMPLOYEE';
    const pathname = request.nextUrl.pathname;

    // ADMIN → full access
    if (role === 'ADMIN') {
      return NextResponse.next();
    }

    // HR → can access HR dashboard + shared admin pages
    if (role === 'HR') {
      if (pathname.startsWith('/hr') || 
          pathname.startsWith('/admin/employees') || 
          pathname.startsWith('/admin/attendance') || 
          pathname.startsWith('/admin/pdf')) {
        return NextResponse.next();
      }
    }

    // EMPLOYEE → only their dashboard
    if (role === 'EMPLOYEE' && pathname.startsWith('/employee')) {
      return NextResponse.next();
    }

    // If role doesn't match the path → redirect to login
    return NextResponse.redirect(new URL('/', request.url));

  } catch (err) {
    // Invalid token → logout and go to login
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/hr/:path*', '/employee/:path*'],
};
