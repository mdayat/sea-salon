import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../libs/prisma";
import {
  handleInvalidAccessToken,
  handleInvalidMethod,
} from "../../utils/middlewares";
import { type Reservation, reservationSchema } from "../../types/reservation";
import type { FailedResponse, SuccessResponse } from "../../types/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<null> | FailedResponse>
) {
  const promise = new Promise(() => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "POST") {
      handleInvalidAccessToken(req, res, (payload) => {
        const result = reservationSchema
          .pick({ serviceType: true, date: true, time: true })
          .safeParse(req.body);

        if (result.success === false) {
          res.status(400).json({
            status: "failed",
            message: "Invalid JSON schema",
          });
          return;
        }

        const reservation = {
          serviceType: result.data.serviceType,
          datetime: `${result.data.date}T${result.data.time}.000Z`,
          customerID: payload.sub!,
        };

        insertReservation(reservation)
          .then(() => {
            res.status(200).json({ status: "success", data: null });
          })
          .catch((error) => {
            // Log the error properly
            console.error(error);

            res.status(500).json({
              status: "failed",
              message: "Failed when inserting a new reservation",
            });
          });
      });
    } else {
      handleInvalidMethod(res, ["POST"]);
    }
  });
  return promise;
}

function insertReservation({
  serviceType,
  datetime,
  customerID,
}: Pick<Reservation, "serviceType"> & {
  datetime: string;
  customerID: string;
}): Promise<null> {
  const promise = new Promise<null>((resolve, reject) => {
    prisma.reservation
      .create({
        data: {
          service_type: serviceType,
          datetime: datetime,
          customer: { connect: { id: customerID } },
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
