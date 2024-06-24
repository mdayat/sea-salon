import type { NextApiResponse } from "next";
import type { FailedResponse } from "../types/api";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function handleInvalidMethod(
  res: NextApiResponse,
  allowedMethods: HTTPMethod[]
): void {
  const bodyPayload: FailedResponse = {
    status: "failed",
    error: { statusCode: 405, message: "Invalid HTTP method" },
  };

  res.setHeader("Allow", allowedMethods.join(", "));
  res.status(bodyPayload.error.statusCode).json(bodyPayload);
}

export { handleInvalidMethod };
