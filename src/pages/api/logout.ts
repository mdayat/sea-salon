import type { NextApiRequest, NextApiResponse } from "next";

import { handleInvalidMethod } from "../../utils/middlewares";
import type { FailedResponse, SuccessResponse } from "../../types/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<null> | FailedResponse>
) {
  const promise = new Promise(() => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET") {
      res.setHeader("Set-Cookie", [
        "access_token=null; HttpOnly; Secure; Same-Site=Lax; Path=/; Max-Age=0",
        "user_role=null; Secure; Same-Site=Lax; Path=/; Max-Age=0",
      ]);

      res.status(200).json({
        status: "success",
        data: null,
      });
    } else {
      handleInvalidMethod(res, ["GET"]);
    }
  });
  return promise;
}
