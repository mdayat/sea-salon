import type { NextApiResponse } from "next";
import type { FailedResponse } from "../types/api";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function handleInvalidMethod(
  res: NextApiResponse,
  allowedMethods: HTTPMethod[]
): void {
  const bodyPayload: FailedResponse = {
    status: "failed",
    error: {
      code: 405,
      sentinel: "InvalidHTTPMethod",
      message: "Invalid HTTP method",
    },
  };

  res.setHeader("Allow", allowedMethods.join(", "));
  res.status(bodyPayload.error.code).json(bodyPayload);
}

export { handleInvalidMethod };
