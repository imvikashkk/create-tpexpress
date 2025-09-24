import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

type RateLimiterOptions = {
  windowMinute: number;
  max: number;
};

const rateLimiter = ({ windowMinute, max }: RateLimiterOptions) => {
  return rateLimit({
    windowMs: windowMinute * 60 * 1000,
    max: max,
    message: `Too many requests created from this IP, please try again after ${windowMinute} minutes`,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (request: Request) =>
      ipKeyGenerator(request.ip || "127.0.0.1"),
  });
};

export default rateLimiter;
