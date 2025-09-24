import _session from "express-session";
import { RedisStore } from "connect-redis";
import redisClient from "@/config/dbs/redis.js";
import env from "@/config/env.js";

const isProduction = process.env.NODE_ENV === "production";

const redisSessionStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
  ttl: 60 * 60, // 1h
  disableTTL: false,
});

const session = _session({
  store: redisSessionStore,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    maxAge: 1000 * 60 * 60, // 1h
    sameSite: "strict",
  },
});

export default session;
