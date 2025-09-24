import {
  RequestHandler,
  Request,
  Response,
  NextFunction,
  ErrorResponse,
} from "express";
import jwt from "jsonwebtoken";
import env from "@/config/env.js";
import redisClient from "@/config/dbs/redis.js";

const AuthenticateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return sendUnauthorizedResponse(res, "Authentication required");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      email: string; // email => email
      id: number; // id => user's id
      iat: number; // iat => Token Issued At
      exp: number; // exp => Token Expire At
      iss: string; // iss => defined in env as frontend url
      jti: string; // jti => JWT Id (for uniqueness of each token) and esily find that, blacklisting and more
    };

    // Check if the token is already expired
    if (decoded.exp * 1000 < Date.now()) {
      res.clearCookie("token");
      return sendUnauthorizedResponse(res, "Token Expired!");
    }

    // Check if the token ID (jti) is blacklisted in Redis
    const isBlacklisted = await redisClient.get(
      `blacklist/${decoded.id}/${decoded.jti}`
    );

    if (isBlacklisted) {
      res.clearCookie("token");
      return sendUnauthorizedResponse(res, "Token has been invalidated!");
    }

    // If all checks pass, attach user data to the request and proceed
    req.user = {
      email: decoded.email,
      id: decoded.id,
      jti: decoded.jti,
      exp: decoded.exp,
    };
    next();
  } catch (error) {
    // This single catch block handles all errors, including JWT verification failures
    if (error instanceof jwt.JsonWebTokenError) {
      res.clearCookie("token");
      return sendUnauthorizedResponse(res, "Invalid token!");
    }

    // For any other unexpected errors, pass them to the next error handler
    next(error);
  }
};

// Helper function
function sendUnauthorizedResponse(res: Response, message: string) {
  const response: ErrorResponse = {
    success: false,
    error: {
      type: "Unauthorized",
      message: message,
      highlight: "Please login to access this resource.",
    },
  };
  return res.status(401).json(response);
}

export default AuthenticateUser;
