import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../libs/prisma";
import {
  handleInvalidAccessToken,
  handleInvalidMethod,
} from "../../utils/middlewares";
import {
  type Reservation,
  type ServiceType,
  reservationSchema,
} from "../../types/reservation";
import type { FailedResponse, SuccessResponse } from "../../types/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<Omit<Reservation, "id">[] | null> | FailedResponse
  >
) {
  const promise = new Promise(() => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET") {
      handleInvalidAccessToken(req, res, () => {
        selectReservations()
          .then((reservations) => {
            const modifiedReservations: Omit<Reservation, "id">[] = new Array(
              reservations.length
            );

            for (let i = 0; i < modifiedReservations.length; i++) {
              const reservation = reservations[i];
              const { date, time } = splitISOStringIntoDateAndTime(
                reservation.datetime.toISOString()
              );

              modifiedReservations[i] = {
                customerName: reservation.customer.full_name,
                phoneNumber: reservation.customer.phone_number,
                serviceType: reservation.service_type,
                date,
                time,
              };
            }

            res
              .status(200)
              .json({ status: "success", data: modifiedReservations });
          })
          .catch((error) => {
            // Log the error properly
            console.error(error);

            res.status(500).json({
              status: "failed",
              message: "Failed when select reservations",
            });
          });
      });
    } else if (req.method === "POST") {
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
      handleInvalidMethod(res, ["GET", "POST"]);
    }
  });
  return promise;
}

function splitISOStringIntoDateAndTime(ISOString: string): {
  date: string;
  time: string;
} {
  const date = ISOString.split("T")[0];
  const time = ISOString.split("T")[1].split(".")[0];
  return { date, time };
}

interface SelectReservationsPromiseValue {
  service_type: ServiceType;
  datetime: Date;
  customer: { full_name: string; phone_number: string };
}

function selectReservations(): Promise<SelectReservationsPromiseValue[]> {
  return new Promise<SelectReservationsPromiseValue[]>((resolve, reject) => {
    prisma.reservation
      .findMany({
        select: {
          customer: { select: { full_name: true, phone_number: true } },
          service_type: true,
          datetime: true,
        },
        orderBy: { datetime: "asc" },
      })
      .then((reservations) => {
        resolve(reservations);
      })
      .catch((error) => {
        reject(error);
      });
  });
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
