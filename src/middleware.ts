import { jwtVerify, type JWTPayload } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { checkAndUpdateUserRoleCookie } from "./utils/cookie";
import type { UserRole } from "./types/user";

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

// This function has possibilities to throw errors
// So handle them gracefully
async function verifyAccessToken(
  accessToken: string
): Promise<{ role: UserRole } & JWTPayload> {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { payload } = await jwtVerify<{ role: UserRole }>(
    accessToken,
    new TextEncoder().encode(JWT_SECRET),
    {
      issuer: "sea_salon",
    }
  );
  return payload;
}

export const config = {
  matcher: ["/", "/dashboard/:path", "/login", "/register"],
};
