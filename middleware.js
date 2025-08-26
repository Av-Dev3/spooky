import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Only protect admin API routes (excluding login)
  if (pathname.startsWith("/api/admin/") && !pathname.includes("login")) {
    const cookie = request.cookies.get("admin_auth");
    
    if (!cookie || cookie.value !== "ok") {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
