import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const path = req.nextUrl.pathname;

  const isOnDashboard = path.startsWith("/dashboard");
  const isOnAuth = path.startsWith("/auth");
  const isOnAdmin = path.startsWith("/admin");

  if (isOnAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  if (isOnDashboard && isLoggedIn && role === "admin") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/dashboard", req.nextUrl),
    );
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/admin/:path*"],
};