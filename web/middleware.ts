import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    
    // Get user role from token
    const userRole = token?.role as string | undefined
    
    console.log("Middleware - Path:", path, "Role:", userRole, "Token:", !!token);
    
    // If no token, let it through (will be handled by authorized callback)
    if (!token) {
      return NextResponse.next();
    }
    
    // Role-based access control
    if (userRole === 'assistant') {
      // Assistants can only access /asistentes routes
      if (path.startsWith('/usuarios')) {
        console.log("Redirecting assistant from /usuarios to /asistentes/dashboard");
        return NextResponse.redirect(new URL('/asistentes/dashboard', req.url))
      }
      // Redirect root to assistant dashboard
      if (path === '/') {
        console.log("Redirecting assistant from / to /asistentes/dashboard");
        return NextResponse.redirect(new URL('/asistentes/dashboard', req.url))
      }
    } else if (userRole === 'user') {
      // Users can only access /usuarios routes
      if (path.startsWith('/asistentes')) {
        console.log("Redirecting user from /asistentes to /usuarios/dashboard");
        return NextResponse.redirect(new URL('/usuarios/dashboard', req.url))
      }
      // Redirect root to user dashboard
      if (path === '/') {
        console.log("Redirecting user from / to /usuarios/dashboard");
        return NextResponse.redirect(new URL('/usuarios/dashboard', req.url))
      }
    }
    
    // Allow the request to continue
    return NextResponse.next()
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
