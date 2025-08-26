import { NextResponse } from "next/server";

/** Protect only API routes, allow static admin files */
export function middleware(req) {
  const { pathname, origin, search } = req.nextUrl;
  
  // Only protect API routes, not static files
  if (!pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  // Allow login API
  if (pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  // Check authentication for other admin API routes
  const cookie = req.cookies.get("admin_auth")?.value;
  if (cookie === "ok") return NextResponse.next();

  return NextResponse.json({ error: "Not authorized" }, { status: 401 });
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
