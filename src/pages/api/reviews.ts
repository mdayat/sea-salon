import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../libs/prisma";
import {
  handleInvalidAccessToken,
  handleInvalidMethod,
} from "../../utils/middlewares";
import type { FailedResponse, SuccessResponse } from "../../types/api";
import { type Review, reviewSchema } from "../../types/review";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<null> | FailedResponse>
) {
  return new Promise(() => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "POST") {
      handleInvalidAccessToken(req, res, (payload) => {
        const result = reviewSchema.safeParse(req.body);
        if (result.success === false) {
          res.status(400).json({
            status: "failed",
            message: "Invalid JSON schema",
          });
          return;
        }

        insertReview({
          userID: payload.sub!,
          rating: result.data.rating,
          description: result.data.description,
        })
          .then(() => {
            res.status(201).json({
              status: "success",
              data: null,
            });
          })
          .catch((error) => {
            // Log the error properly
            console.error(error);

            res.status(500).json({
              status: "failed",
              message: "Failed when inserting a new review",
            });
          });
      });
    } else {
      handleInvalidMethod(res, ["POST"]);
    }
  });
}

function insertReview({
  userID,
  rating,
  description,
}: Review & { userID: string }): Promise<null> {
  return new Promise((resolve, reject) => {
    prisma.review
      .create({
        data: {
          reviewer: { connect: { id: userID } },
          rating,
          description,
        },
      })
      .then(() => {
        resolve(null);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
