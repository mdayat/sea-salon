type RegisteredEmail = "RegisteredEmail";
type RegisteredPhoneNumber = "RegisteredPhoneNumber";
type InvalidJSON = "InvalidJSON";
type InvalidHTTPMethod = "InvalidHTTPMethod";
type ServerError = "ServerError";
type LoginFailed = "LoginFailed";

type SentinelError =
  | RegisteredEmail
  | RegisteredPhoneNumber
  | InvalidJSON
  | InvalidHTTPMethod
  | ServerError
  | LoginFailed;

export type { SentinelError };
