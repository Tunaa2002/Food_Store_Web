// middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('user');

  if (!token) {
    return NextResponse.redirect('/login');
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Thêm thông tin người dùng vào request nếu cần
    req.user = decoded;

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect('/login');
  }
}

// Định nghĩa các route cần bảo vệ trong middleware
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'], // Thay đổi tùy theo các route bạn muốn bảo vệ
};
