import type { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JWTPayload } from "jose";
import type { UserRole } from "../types/user";

function getCookieValue(name: string): string {
  const decodedCookie = decodeURIComponent(document.cookie);
  const splittedCookie = decodedCookie.split(";");
  let cookieValue = "";
  for (let i = 0; i < splittedCookie.length; i++) {
    if (splittedCookie[i].includes(name)) {
      cookieValue = splittedCookie[i].split("=")[1];
    }
  }
  return cookieValue;
}

function checkAndUpdateUserRoleCookie(
  req: NextRequest,
  res: NextResponse,
  jwtPayload: { role: UserRole } & JWTPayload
) {
  const role = req.cookies.get("user_role");
  const unixTimestampInSecs = Math.floor(Date.now() / 1000);

  if (role === undefined) {
    res.cookies.set({
      name: "user_role",
      value: jwtPayload.role,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: jwtPayload.exp! - unixTimestampInSecs,
    });
  } else if (role.value !== "customer" && role.value !== "admin") {
    res.cookies.delete("user_role");
    res.cookies.set({
      name: "user_role",
      value: jwtPayload.role as string,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: jwtPayload.exp! - unixTimestampInSecs,
    });
  }
}

export { getCookieValue, checkAndUpdateUserRoleCookie };
