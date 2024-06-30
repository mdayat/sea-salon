interface SuccessResponse<T> {
  status: "success";
  data: T | null;
}

interface FailedResponse {
  status: "failed";
  message: string;
}

export type { SuccessResponse, FailedResponse };
