import {
  userCreateBodySchema,
  usersQuerySchema,
  userByIdParamSchema,
  loginBodySchema,
  logoutBodySchema,
} from "@/validators/requestSchema/userSchemaValidation.js";
import { validate } from "@/validators/validate.js";
import UserController from "@/controllers/userControllers.js";
import express from "express";
import rateLimiter from "@/middlewares/security/ratelimiter.js";
import slowDowner from "@/middlewares/security/slowdowner.js";
// import  AuthenticateUser  from '@/middlewares/auth/AuthenticateUser';

const router = express.Router();
router
  .post(
    "/signup",
    rateLimiter({ windowMinute: 30, max: 10 }),
    validate({ body: userCreateBodySchema }),
    UserController.signup
  )
  .get(
    "/users",
    slowDowner({ windowMinute: 10, delayAfter: 100, delayMs: 200 }),
    validate({ query: usersQuerySchema }),
    UserController.getUser
  )
  .get(
    "/user/:id",
    slowDowner({ windowMinute: 10, delayAfter: 80, delayMs: 200 }),
    validate({ params: userByIdParamSchema }),
    UserController.getUserById
  )
  .post(
    "/login",
    rateLimiter({ windowMinute: 30, max: 5 }),
    validate({ body: loginBodySchema }),
    UserController.login
  )
  .post(
    "/logout",
    slowDowner({ windowMinute: 10, delayAfter: 80, delayMs: 200 }),
    validate({ body: logoutBodySchema }),
    UserController.logout
  );

export default router;
