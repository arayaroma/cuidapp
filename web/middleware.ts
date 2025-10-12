import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - register (register page - if you have one)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|.*\\..*).*)',
  ],
}
