import { Prisma } from "@prisma/client";
import argon2 from "argon2";
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
      const result = customerSchema.safeParse(req.body);
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

      hashPassword(result.data.password)
        .then((hashedPassword) => {
          insertCustomer(result.data, hashedPassword)
            .then(() => {
              res.status(200).json({ status: "success", data: null });
            })
            .catch((error) => {
              if (
                error instanceof Prisma.PrismaClientKnownRequestError ===
                false
              ) {
                // Log the error properly
                console.error(error);

                res.status(500).json({
                  status: "failed",
                  error: {
                    code: 500,
                    sentinel: "ServerError",
                    message: "Failed when inserting a new user",
                  },
                });
                return;
              }

              if (error.code === "P2002") {
                const uniqueField = (error.meta!.target as string[])[0];
                if (uniqueField === "email") {
                  res.status(400).json({
                    status: "failed",
                    error: {
                      code: 400,
                      sentinel: "RegisteredEmail",
                      message: "Email is already registered",
                    },
                  });
                } else {
                  res.status(400).json({
                    status: "failed",
                    error: {
                      code: 400,
                      sentinel: "RegisteredPhoneNumber",
                      message: "Phone number is already registered",
                    },
                  });
                }
              }
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
              message: "Failed when hashing a password",
            },
          });
        });
    } else {
      handleInvalidMethod(res, ["POST"]);
    }
  });
  return promise;
}

function hashPassword(password: string): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => {
    argon2
      .hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
      })
      .then((hashedPassword) => {
        resolve(hashedPassword);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

function insertCustomer(
  customer: Omit<Customer, "password">,
  hashedPassword: string
): Promise<null> {
  const promise = new Promise<null>((resolve, reject) => {
    prisma.user
      .create({
        data: {
          full_name: customer.fullName,
          email: customer.email,
          phone_number: customer.phoneNumber,
          password: hashedPassword,
          role: "customer",
        },
      })
      .then(() => {
        resolve(null);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}
