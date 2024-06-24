import argon2 from "argon2";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../libs/prisma";
import { handleInvalidMethod } from "../../utils/middlewares";
import { customerSchema } from "../../types/customer";
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
          error: { statusCode: 400, message: "Invalid JSON schema" },
        });
        return;
      }

      argon2
        .hash(result.data.password, {
          type: argon2.argon2id,
          memoryCost: 19456,
          timeCost: 2,
          parallelism: 1,
        })
        .then((hashedPassword) => {
          prisma.user
            .create({
              data: {
                full_name: result.data.fullName,
                email: result.data.email,
                phone_number: result.data.phoneNumber,
                password: hashedPassword,
                role: "customer",
              },
            })
            .then(() => {
              res.status(200).json({ status: "success", data: null });
            })
            .catch((error) => {
              res.status(500).json({
                status: "failed",
                error: { statusCode: 500, message: "Server error" },
              });

              // Log the error properly
              console.error(error);
            });
        })
        .catch((error) => {
          res.status(500).json({
            status: "failed",
            error: { statusCode: 500, message: "Server error" },
          });

          // Log the error properly
          console.error(error);
        });
    } else {
      handleInvalidMethod(res, ["POST"]);
    }
  });
  return promise;
}
