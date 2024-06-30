import argon2 from "argon2";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../libs/prisma";
import { createAccessToken } from "../../utils/jwt";
import { handleInvalidMethod } from "../../utils/middlewares";
import { userSchema, type User } from "../../types/user";
import type { FailedResponse, SuccessResponse } from "../../types/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<null> | FailedResponse>
) {
  const promise = new Promise(() => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "POST") {
      const result = userSchema
        .pick({ email: true, password: true })
        .safeParse(req.body);

      if (result.success === false) {
        res.status(400).json({
          status: "failed",
          message: "Invalid JSON schema",
        });
        return;
      }

      selectUser(result.data.email)
        .then((user) => {
          if (user === null) {
            res.status(400).json({
              status: "failed",
              message: "Email or password is incorrect",
            });
            return;
          }

          argon2
            .verify(user.password, result.data.password)
            .then((isValidPassword) => {
              if (isValidPassword === false) {
                res.status(400).json({
                  status: "failed",
                  message: "Email or password is incorrect",
                });
                return;
              }

              const payload = { role: user.role };
              const monthInSeconds = 2628000;

              createAccessToken(user.id, payload, monthInSeconds)
                .then((accessToken) => {
                  res.setHeader("Set-Cookie", [
                    `access_token=${accessToken}; HttpOnly; Secure; Same-Site=Lax; Path=/; Max-Age=${monthInSeconds}`,
                    `user_role=${user.role}; Secure; Same-Site=Lax; Path=/; Max-Age=${monthInSeconds}`,
                  ]);

                  res.status(200).json({
                    status: "success",
                    data: null,
                  });
                })
                .catch((error) => {
                  // Log the error properly
                  console.error(error);

                  res.status(500).json({
                    status: "failed",
                    message: "Failed when verifying a password",
                  });
                });
            })
            .catch((error) => {
              // Log the error properly
              console.error(error);

              res.status(500).json({
                status: "failed",
                message: "Failed when verifying a password",
              });
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
    } else {
      handleInvalidMethod(res, ["POST"]);
    }
  });
  return promise;
}

function selectUser(
  email: string
): Promise<Omit<User, "fullName" | "phoneNumber"> | null> {
  const promise = new Promise<Omit<User, "fullName" | "phoneNumber"> | null>(
    (resolve, reject) => {
      prisma.user
        .findUnique({
          where: { email },
          select: { id: true, email: true, password: true, role: true },
        })
        .then((user) => {
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    }
  );
  return promise;
}
