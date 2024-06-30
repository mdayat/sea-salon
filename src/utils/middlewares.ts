import type { NextApiResponse } from "next";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
function handleInvalidMethod(
  res: NextApiResponse,
  allowedMethods: HTTPMethod[]
): void {
  res.setHeader("Allow", allowedMethods.join(", "));
  res.status(405).json({
    status: "failed",
    message: "Invalid HTTP method",
  });
}

export { handleInvalidMethod };
