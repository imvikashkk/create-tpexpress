import jwt, { SignOptions } from "jsonwebtoken";
import env from "@/config/env.js";

export interface DecodedTokenPayload {
  id: number;
  email: string;
  jti: string; // JWT ID
  exp: number; // Expiration time in seconds
}

export const genrateToken = (
  data: object,
  { rememberMe, tokenId }: { rememberMe: boolean; tokenId: string }
) => {
  const expiresIn = rememberMe ? "7d" : "1d";
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expiresIn,
    issuer: env.JWT_ISSUER, // issuer like URL
    jwtid: tokenId, // mainly use for blacklisting
  };
  const token = jwt.sign(data, env.JWT_SECRET, options);
  return token;
};
