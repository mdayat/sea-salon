import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../libs/prisma";
import { handleInvalidMethod } from "../../utils/middlewares";
import { customerSchema, type Customer } from "../../types/customer";
import type { FailedResponse, SuccessResponse } from "../../types/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<{ accessToken: string }> | FailedResponse
  >
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
              createAccessToken(user.id, payload)
                .then((accessToken) => {
                  res.status(200).json({
                    status: "success",
                    data: { accessToken },
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

function createAccessToken<T extends object>(
  clientID: string,
  payload: T
): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const monthInSeconds = 2628000;

    jwt.sign(
      payload,
      JWT_SECRET as string,
      {
        issuer: "sea_salon",
        subject: clientID,
        expiresIn: monthInSeconds,
      },
      (error, jwtString) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(jwtString!);
        }
      }
    );
  });
  return promise;
}
