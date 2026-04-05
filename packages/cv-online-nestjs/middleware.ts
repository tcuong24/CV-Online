// middleware.ts — đặt ở root project (ngang hàng với /app)
export { default } from 'next-auth/middleware';

export const config = {
  // Các route cần đăng nhập mới truy cập được
  matcher: [
    '/cvs/:path*',
    '/cvs/create',
    '/editor/:path*',
  ],
};

// Nếu user chưa đăng nhập truy cập các route trên
// → tự động redirect về authOptions.pages.signIn ('/login')