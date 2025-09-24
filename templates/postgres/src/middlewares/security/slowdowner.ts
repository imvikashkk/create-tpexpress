import slowDown from "express-slow-down";
import { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

type SlowDownOptions = {
  windowMinute: number;
  delayAfter: number;
  delayMs: number;
};

const slowDowner = ({ windowMinute, delayAfter, delayMs }: SlowDownOptions) => {
  return slowDown({
    windowMs: windowMinute * 60 * 1000,
    delayAfter: delayAfter,
    delayMs: (hits: number) => {
      return (hits - delayAfter) * delayMs;
    },
    legacyHeaders: false,
    keyGenerator: (request: Request) =>
      ipKeyGenerator(request.ip || "127.0.0.1"),
  });
};

export default slowDowner;
