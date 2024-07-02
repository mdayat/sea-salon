import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../libs/prisma";
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
        .omit({ id: true, role: true })
        .safeParse(req.body);

      if (result.success === false) {
        res.status(400).json({
          status: "failed",
          message: "Invalid JSON schema",
        });
        return;
      }

      bcrypt
        .hash(result.data.password, 10)
        .then((hashedPassword) => {
          insertUser(result.data, hashedPassword)
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
                  message: "Failed when insert new user",
                });
                return;
              }

              if (error.code === "P2002") {
                const uniqueField = (error.meta!.target as string[])[0];
                if (uniqueField === "email") {
                  res.status(400).json({
                    status: "failed",
                    message: "Email is already registered",
                  });
                } else {
                  res.status(400).json({
                    status: "failed",
                    message: "Phone number is already registered",
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
            message: "Failed when hash a password",
          });
        });
    } else {
      handleInvalidMethod(res, ["POST"]);
    }
  });
  return promise;
}

function insertUser(
  user: Omit<User, "password" | "id" | "role">,
  hashedPassword: string
): Promise<null> {
  const promise = new Promise<null>((resolve, reject) => {
    prisma.user
      .create({
        data: {
          full_name: user.fullName,
          email: user.email,
          phone_number: user.phoneNumber,
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
