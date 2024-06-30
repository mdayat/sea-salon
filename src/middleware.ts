import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyAccessToken } from "./utils/jwt";
import { checkAndUpdateUserRoleCookie } from "./utils/cookie";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname === "/") {
    const accessToken = req.cookies.get("access_token");
    const res = NextResponse.next();

    if (accessToken !== undefined) {
      try {
        const payload = await verifyAccessToken(accessToken.value);
        checkAndUpdateUserRoleCookie(req, res, payload);
      } catch (error) {
        // Log the error properly
        console.error(error);
        res.cookies.delete("access_token");
        res.cookies.delete("user_role");
      }
    } else {
      res.cookies.delete("user_role");
    }

    return res;
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    const accessToken = req.cookies.get("access_token");
    if (accessToken !== undefined) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const accessToken = req.cookies.get("access_token");
    if (accessToken === undefined) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("user_role");
      return res;
    }

    try {
      const res = NextResponse.next();
      const payload = await verifyAccessToken(accessToken.value);
      checkAndUpdateUserRoleCookie(req, res, payload);
      return res;
    } catch (error) {
      // Log the error properly
      console.error(error);

      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("access_token");
      res.cookies.delete("user_role");
      return res;
    }
  }
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path"],
};
