import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-2026';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const role = decoded.role;
    const pathname = request.nextUrl.pathname;

    // Allow Admin full access
    if (role === 'ADMIN') {
      return NextResponse.next();
    }

    // Allow HR access to employee management, attendance and PDF
    if (role === 'HR') {
      if (pathname.startsWith('/admin/employees') || 
          pathname.startsWith('/admin/attendance') || 
          pathname.startsWith('/admin/pdf')) {
        return NextResponse.next();
      }
    }

    // Employee only allowed to their own dashboard
    if (role === 'EMPLOYEE' && pathname.startsWith('/employee')) {
      return NextResponse.next();
    }

    // If none of the above, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  } catch {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/hr/:path*', '/employee/:path*'],
};
