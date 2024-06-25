import type { SentinelError } from "./sentinelError";

interface SuccessResponse<T> {
  status: "success";
  data: T | null;
}

interface FailedResponse {
  status: "failed";
  error: {
    code: number;
    sentinel: SentinelError;
    message: string;
  };
}

export type { SuccessResponse, FailedResponse };
