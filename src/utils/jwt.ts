import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { User } from "../types/user";

function createAccessToken(
  clientID: string,
  payload: JWTPayload,
  duration: number // In seconds
): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const unixTimestampInSecs = Math.floor(Date.now() / 1000);
    const expiration = unixTimestampInSecs + duration;

    new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer("sea_salon")
      .setIssuedAt(unixTimestampInSecs)
      .setSubject(clientID)
      .setExpirationTime(expiration)
      .setNotBefore(unixTimestampInSecs)
      .sign(new TextEncoder().encode(JWT_SECRET))
      .then((jwtString) => {
        resolve(jwtString);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

function verifyAccessToken(
  accessToken: string
): Promise<Pick<User, "role"> & JWTPayload> {
  const promise = new Promise<Pick<User, "role"> & JWTPayload>(
    (resolve, reject) => {
      const JWT_SECRET = process.env.JWT_SECRET;
      jwtVerify<Pick<User, "role">>(
        accessToken,
        new TextEncoder().encode(JWT_SECRET),
        {
          issuer: "sea_salon",
        }
      )
        .then(({ payload }) => {
          resolve(payload);
        })
        .catch((error) => {
          reject(error);
        });
    }
  );
  return promise;
}

export { createAccessToken, verifyAccessToken };
