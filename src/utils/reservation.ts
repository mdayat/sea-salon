import axios from "axios";
import type { Reservation } from "../types/reservation";

function dateFormatter(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dateOfMonth = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${dateOfMonth}`;
}

function getMinAndMaxDate(): { minDate: string; maxDate: string } {
  const minDate = new Date();
  const maxDate = new Date(new Date().getFullYear(), 11, 31);
  return { minDate: dateFormatter(minDate), maxDate: dateFormatter(maxDate) };
}

function createReservation(
  reservation: Pick<Reservation, "serviceType" | "date" | "time">
): Promise<null> {
  const promise = new Promise<null>((resolve, reject) => {
    axios
      .post("/api/reservations", reservation, {
        headers: { "Content-Type": "application/json" },
        timeout: 3000, // ms
      })
      .then(() => {
        resolve(null);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            reject(error.response.data);
          } else {
            // Retry and log the error properly
            console.error("Error", error.message);
            reject(error.response.data);
          }
        } else if (error.request) {
          // Retry and log the error properly
          console.error("Error", error.message);
        } else {
          // Log the error properly
          console.error("Error", error.message);
        }
      });
  });
  return promise;
}

export { createReservation, getMinAndMaxDate };
