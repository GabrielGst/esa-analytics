// middleware.ts

import { auth } from "@/auth"
import { convertCompilerOptionsFromJson } from "typescript";
 
export default auth((req) => {
  // console.log(`[AUTH] Authentication status is ${req.auth?.user} when trying to access ${req.nextUrl.pathname}.`)

  const pathname = req.nextUrl.pathname;
  const role = req.auth?.user.role;
  const group = req.auth?.user.group_membership;
  // console.log(pathname)
  // console.log(role)
  // console.log(group)
  
  // Public route — allow
  if (pathname === "/login" || pathname === "/home/contact" || pathname === "/logout" ) return;

  // Not authenticated — redirect
  if (!auth) {
    console.log(new URL("/login", req.nextUrl.origin));
    return Response.redirect(new URL("/login", req.nextUrl.origin));

  } else {

    if (group !== 'authorized') {
      return Response.redirect(new URL("/login", req.nextUrl.origin));

    } else {
      
      if (pathname === "/documentation/developpers" && role !== "admin") {
        return Response.redirect(new URL("/login", req.nextUrl.origin))
      }

      if (pathname.startsWith("/profile") && role === "admin") {
        return Response.redirect(new URL("/profile/admin", req.nextUrl.origin));
      }

      if (pathname.startsWith("/profile") && role === "member") {
        return Response.redirect(new URL("/profile/member", req.nextUrl.origin));
      }
    }
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - static files (/_next, /fonts, /images)
     * - API routes (/api)
     * - auth pages (/login, /logout)
     */
    // '/((?!api|_next|static|images|favicon.ico|login|logout).*)'
    // v2
    '/((?!api|_next|static|images|favicon.ico|login|logout|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|pdf|woff2?|ttf|eot)).*)',
    // "/documentation/:path*", "/tools/:path*", "/testclient", '/profile/:path*',
  ]
};


