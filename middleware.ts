export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/interview/:path*',
    '/reports/:path*',
    '/admin/:path*',
  ],
};
