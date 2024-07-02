import axios from "axios";
import type { User } from "../types/user";
import type { SuccessResponse } from "../types/api";

type GetUserResponse = Pick<User, "fullName" | "phoneNumber">;
function getUser(): Promise<GetUserResponse> {
  const promise = new Promise<GetUserResponse>((resolve, reject) => {
    axios
      .get<SuccessResponse<GetUserResponse>>("/api/users/me", {
        timeout: 3000, // ms
      })
      .then((res) => {
        resolve(res.data.data!);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            reject(error.response.data);
          } else {
            // Retry and log the error properly
            console.error("Error", error.message);
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

export { getUser };
