import type { NextApiRequest, NextApiResponse } from "next";
import type { JWTPayload } from "jose";

import { verifyAccessToken } from "./jwt";
import type { User } from "../types/user";

function handleInvalidAccessToken(
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line no-unused-vars
  onSuccess: (payload: Pick<User, "role"> & JWTPayload) => void
) {
  const accessToken = req.cookies.access_token;
  if (accessToken === undefined) {
    res.setHeader(
      "Set-Cookie",
      `user_role=null; Secure; Same-Site=Lax; Path=/; Max-Age=0`
    );

    res.status(401).json({
      status: "failed",
      message: "Authentication credentials is missing",
    });
  } else {
    verifyAccessToken(accessToken)
      .then((payload) => {
        onSuccess(payload);
      })
      .catch(() => {
        res.setHeader("Set-Cookie", [
          `access_token=null; HttpOnly; Secure; Same-Site=Lax; Path=/; Max-Age=0`,
          `user_role=null; Secure; Same-Site=Lax; Path=/; Max-Age=0`,
        ]);

        res.status(401).json({
          status: "failed",
          message: "Invalid authentication credentials",
        });
      });
  }
}

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
function handleInvalidMethod(
  res: NextApiResponse,
  allowedMethods: HTTPMethod[]
): void {
  res.setHeader("Allow", allowedMethods.join(", "));
  res.status(405).json({
    status: "failed",
    message: "Invalid HTTP method",
  });
}

export { handleInvalidAccessToken, handleInvalidMethod };
