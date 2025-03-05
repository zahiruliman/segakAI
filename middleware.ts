import { NextRequest, NextResponse } from "next/server";

// Define paths that should be protected (require authentication)
const protectedPaths = ["/dashboard", "/profile", "/settings", "/onboarding"];

// Define public paths that don't require authentication
const publicPaths = ["/", "/login", "/signup", "/auth/callback"];

// Define paths that should be skipped by middleware
const skipMiddlewarePaths = [
  "/_next",
  "/api",
  "/static",
  "/images",
  "/favicon.ico",
  "/manifest.json",
];

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for certain paths
  if (skipMiddlewarePaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path));
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname === path || pathname.startsWith(path));
  
  // Get auth token from cookies
  const authToken = request.cookies.get("sb-auth-token")?.value;
  const accessToken = request.cookies.get("sb-access-token")?.value;
  
  // If no auth token and trying to access protected route, redirect to login
  if (!authToken && !accessToken && isProtectedPath) {
    console.log("No auth token found, redirecting to login");
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If has auth token and trying to access login/signup, redirect to dashboard
  if ((authToken || accessToken) && (pathname === "/login" || pathname === "/signup")) {
    console.log("Auth token found, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
} 