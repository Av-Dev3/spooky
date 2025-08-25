import { NextResponse } from "next/server";

/** Protect /admin/* and /api/admin/* except the login page itself */
export function middleware(req) {
  const { pathname, origin, search } = req.nextUrl;
  const needsAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin/");

  if (!needsAuth) return NextResponse.next();

  // Allow the login page itself
  if (pathname === "/admin/login.html" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("admin_auth")?.value;
  if (cookie === "ok") return NextResponse.next();

  const nextUrl = encodeURIComponent(pathname + (search || ""));
  return NextResponse.redirect(`${origin}/admin/login.html?next=${nextUrl}`);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
