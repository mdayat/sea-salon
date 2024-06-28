import axios from "axios";
import type { Customer } from "../types/customer";
import type { SentinelError } from "../types/sentinelError";

interface RegistrationStatus {
  status: "success" | "failed";
  message: string;
}

function registerNewCustomer(customer: Customer): Promise<RegistrationStatus> {
  const promise = new Promise<RegistrationStatus>((resolve) => {
    axios
      .post("/api/register", customer, {
        headers: { "Content-Type": "application/json" },
        timeout: 3000, // ms
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          const sentinelError: SentinelError = res.data.error.sentinel;
          switch (sentinelError) {
            case "RegisteredEmail": {
              resolve({
                status: "failed",
                message: "Email is already registered.",
              });
              break;
            }

            case "RegisteredPhoneNumber": {
              resolve({
                status: "failed",
                message: "Phone number is already registered.",
              });
              break;
            }

            default: {
              resolve({
                status: "failed",
                message: "Please check the data you entered again.",
              });
              break;
            }
          }
          return;
        }

        resolve({
          status: "success",
          message: "We have created your account.",
        });
      })
      .catch((error) => {
        if (error.response) {
          // Retry the request properly when the request is 500, indicating server error
          resolve({
            status: "failed",
            message: "Something is wrong. Please try again.",
          });
        } else if (error.request) {
          resolve({
            status: "failed",
            message: "We couldn't process your request due to a timeout.",
          });
        } else {
          // Log the error properly
          console.error("Error", error.message);
        }
      });
  });
  return promise;
}

interface LoginStatus {
  status: "success" | "failed";
  message: string;
}

function login(
  customer: Omit<Customer, "fullName" | "phoneNumber">
): Promise<LoginStatus> {
  const promise = new Promise<LoginStatus>((resolve) => {
    axios
      .post("/api/login", customer, {
        headers: { "Content-Type": "application/json" },
        timeout: 3000, // ms
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          resolve({
            status: "failed",
            message: "Your email or password is incorrect.",
          });
          return;
        }

        resolve({
          status: "success",
          message: "You will be redirected to dashboard.",
        });
      })
      .catch((error) => {
        if (error.response) {
          // Retry the request properly when the request is 500, indicating server error
          resolve({
            status: "failed",
            message: "Something is wrong. Please try again.",
          });
        } else if (error.request) {
          resolve({
            status: "failed",
            message: "We couldn't process your request due to a timeout.",
          });
        } else {
          // Log the error properly
          console.error("Error", error.message);
        }
      });
  });
  return promise;
}

type LogoutStatus =
  | {
      status: "failed";
      message: string;
    }
  | {
      status: "success";
    };

function logout(): Promise<LogoutStatus> {
  const promise = new Promise<LogoutStatus>((resolve) => {
    axios
      .get("/api/logout", {
        timeout: 3000, // ms
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      })
      .then(() => {
        resolve({ status: "success" });
      })
      .catch((error) => {
        if (error.response) {
          // Retry the request properly when the request is 500, indicating server error
          resolve({
            status: "failed",
            message: "Something is wrong. Please try again.",
          });
        } else if (error.request) {
          resolve({
            status: "failed",
            message: "We couldn't process your request due to a timeout.",
          });
        } else {
          // Log the error properly
          console.error("Error", error.message);
        }
      });
  });
  return promise;
}

export { registerNewCustomer, login, logout };
