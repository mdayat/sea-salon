type RegisteredEmail = "RegisteredEmail";
type RegisteredPhoneNumber = "RegisteredPhoneNumber";
type InvalidJSON = "InvalidJSON";
type InvalidHTTPMethod = "InvalidHTTPMethod";
type ServerError = "ServerError";

type SentinelError =
  | ServerError
  | InvalidJSON
  | InvalidHTTPMethod
  | RegisteredEmail
  | RegisteredPhoneNumber;

export type { SentinelError };
