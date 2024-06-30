import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../libs/prisma";
import { verifyAccessToken } from "../../../utils/jwt";
import { handleInvalidMethod } from "../../../utils/middlewares";
import type { FailedResponse, SuccessResponse } from "../../../types/api";
import type { User } from "../../../types/user";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<Pick<User, "fullName" | "phoneNumber">> | FailedResponse
  >
) {
  const promise = new Promise(() => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET") {
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
        return;
      }

      verifyAccessToken(accessToken)
        .then((payload) => {
          const userID = payload.sub as string;
          selectUser(userID)
            .then((user) => {
              res.status(200).json({
                status: "success",
                data: user,
              });
            })
            .catch((error) => {
              // Log the error properly
              console.error(error);

              res.status(500).json({
                status: "failed",
                message: "Failed when select a user",
              });
            });
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
    } else {
      handleInvalidMethod(res, ["GET"]);
    }
  });
  return promise;
}

function selectUser(
  userID: string
): Promise<Pick<User, "fullName" | "phoneNumber">> {
  const promise = new Promise<Pick<User, "fullName" | "phoneNumber">>(
    (resolve, reject) => {
      prisma.user
        .findUnique({
          where: { id: userID },
          select: { full_name: true, phone_number: true },
        })
        .then((user) => {
          const modifiedUserKey = {
            fullName: user!.full_name,
            phoneNumber: user!.phone_number,
          };

          resolve(modifiedUserKey);
        })
        .catch((error) => {
          reject(error);
        });
    }
  );
  return promise;
}
