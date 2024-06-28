import argon2 from "argon2";
import { SignJWT, type JWTPayload } from "jose";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../libs/prisma";
import { handleInvalidMethod } from "../../utils/middlewares";
import { customerSchema, type Customer } from "../../types/customer";
import type { FailedResponse, SuccessResponse } from "../../types/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<null> | FailedResponse>
) {
  const promise = new Promise(() => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "POST") {
      const result = customerSchema
        .omit({ fullName: true, phoneNumber: true })
        .safeParse(req.body);

      if (result.success === false) {
        res.status(400).json({
          status: "failed",
          error: {
            code: 400,
            sentinel: "InvalidJSON",
            message: "Invalid JSON schema for creating a new user",
          },
        });
        return;
      }

      selectCustomer(result.data.email)
        .then((user) => {
          if (user === null) {
            res.status(400).json({
              status: "failed",
              error: {
                code: 400,
                sentinel: "LoginFailed",
                message: "Email or password is incorrect",
              },
            });
            return;
          }

          argon2
            .verify(user.password, result.data.password)
            .then((isValidPassword) => {
              if (isValidPassword === false) {
                res.status(400).json({
                  status: "failed",
                  error: {
                    code: 400,
                    sentinel: "LoginFailed",
                    message: "Email or password is incorrect",
                  },
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
                    error: {
                      code: 500,
                      sentinel: "ServerError",
                      message: "Failed when verifying a password",
                    },
                  });
                });
            })
            .catch((error) => {
              // Log the error properly
              console.error(error);

              res.status(500).json({
                status: "failed",
                error: {
                  code: 500,
                  sentinel: "ServerError",
                  message: "Failed when verifying a password",
                },
              });
            });
        })
        .catch((error) => {
          // Log the error properly
          console.error(error);

          res.status(500).json({
            status: "failed",
            error: {
              code: 500,
              sentinel: "ServerError",
              message: "Failed when select a user",
            },
          });
        });
    } else {
      handleInvalidMethod(res, ["POST"]);
    }
  });
  return promise;
}

interface CustomerWithIDAndRole
  extends Omit<Customer, "fullName" | "phoneNumber"> {
  id: string;
  role: "customer" | "admin";
}

function selectCustomer(email: string): Promise<CustomerWithIDAndRole | null> {
  const promise = new Promise<CustomerWithIDAndRole | null>(
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

function createAccessToken(
  clientID: string,
  payload: JWTPayload,
  duration: number // In seconds
): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const unixTimestampInSecs = Math.floor(Date.now() / 1000);
    const expiration = unixTimestampInSecs + duration;

    new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer("sea_salon")
      .setIssuedAt(unixTimestampInSecs)
      .setSubject(clientID)
      .setExpirationTime(expiration)
      .setNotBefore(unixTimestampInSecs)
      .sign(new TextEncoder().encode(JWT_SECRET))
      .then((jwtString) => {
        resolve(jwtString);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}
