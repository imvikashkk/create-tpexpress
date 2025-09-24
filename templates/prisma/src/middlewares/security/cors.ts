import _cors, { CorsOptions } from "cors";
import { RequestHandler } from "express";
import env from "@/config/env.js";

const productionWhitelist = env.CORS_ORIGINS;

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // In non-production environments, allow all origins.

    if (env.NODE_ENV !== "production") {
      callback(null, true);
      return;
    }
    if (!origin || productionWhitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-Custom-Header",
  ],
  exposedHeaders: ["Content-Length", "X-Custom-Header"],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204, // Some legacy browsers
};

const cors: RequestHandler = _cors(corsOptions);
export default cors;
