import { NextRequest, NextResponse } from "next/server";

export async function middleware(req = NextRequest) {
  const url = req.nextUrl.clone();
  const validPath = [
    "/",
    "/user/home-student",
    "/user/home-landlord",
    "/user/home-admin",
  ];
  if (validPath.includes(url.pathname)) {
    const isLoggedIn = req.cookies.get("loggedIn") || false;
    url.pathname = isLoggedIn
      ? `user/home-${req.cookies.get("mode")}`
      : "user/login";
    return NextResponse.rewrite(url);
  }
}
