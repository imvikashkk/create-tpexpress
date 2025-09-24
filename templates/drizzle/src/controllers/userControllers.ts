import {
  Request,
  Response,
  NextFunction,
  SuccessResponse,
  ErrorResponse,
} from 'express';
import {
  UserCreateBodySchema,
  UserByIdParamSchema,
  UsersQuerySchema,
  LoginBodySchema,
  LogoutBodySchema,
} from '@/validators/requestSchema/userSchemaValidation.js';
import bcrypt from 'bcrypt';
import env from '@/config/env.js';
import UserService from '@/services/userServices.js';
import redisClient from '@/config/dbs/redis.js';
import AppError from '@/lib/AppError.js';
import { genrateToken, DecodedTokenPayload } from '@/utils/genrateToken.js';
import crypto from 'crypto';
import callFrom from '@/lib/callFrom.js';
import callBy from '@/lib/callBy.js';
import jwt from 'jsonwebtoken';

const getUser = async (
  _req: Request,
  res: Response<{}, { query: UsersQuerySchema }>,
  next: NextFunction
) => {
  try {
    const { limit = 10, skip = 0 } = res?.locals?.query;
    const cacheKey = `users:limit=${limit}:skip=${skip}`;
    const cachedUsers = await redisClient.get(cacheKey);

    if (cachedUsers) {
      const users = JSON.parse(cachedUsers);
      const response: SuccessResponse = {
        success: true,
        message: 'User List fetched successfully from cache!',
        data: { users },
      };
      return res.status(200).json(response);
    }

    const users = await UserService.getAllUsers({ limit, skip });
    if (users.length > 0) {
      await redisClient.set(cacheKey, JSON.stringify(users), { EX: 60 * 30 });
    }

    const response: SuccessResponse = {
      success: true,
      message: 'User List fetched successfully from database!',
      data: { users },
    };
    return res.status(200).json(response);
  } catch (error: unknown) {
    return next(error);
  }
};

const getUserById = async (
  _req: Request,
  res: Response<{}, { params: UserByIdParamSchema }>,
  next: NextFunction
) => {
  try {
    const user = await UserService.getUserById(res.locals.params.id);
    if (!user || !user?.id) {
      const response: ErrorResponse = {
        success: false,
        error: {
          type: 'NotFound',
          message: 'User not found!',
          highlight: `User does not exist with ID ${res.locals.params.id}`,
          details: {},
        },
      };
      return res.status(404).json(response);
    }
    const response: SuccessResponse = {
      success: true,
      message: 'User fetched successfully!',
      data: { user: user },
    };
    res.status(200).json(response);
  } catch (error: unknown) {
    return next(error);
  }
};

const signup = async (
  req: Request<{}, {}, UserCreateBodySchema, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fname, lname, email, password } = req.body;
    const SALT = env.PASSWORD_SALT_ROUNDS;
    const PEPPER = env.PASSWORD_PEPPER;
    const hashedPassword = await bcrypt.hash(password + PEPPER, SALT);

    const user = await UserService.createUser({
      fname,
      lname: lname ?? null,
      email,
      password: hashedPassword,
    });

    const response: SuccessResponse = {
      success: true,
      message: 'User created successfully',
      data: { user: user },
    };
    res.status(201).json(response);
  } catch (error: unknown) {
    return next(error);
  }
};

const login = async (
  req: Request<unknown, unknown, LoginBodySchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, rememberMe } = req.body;

    /* User Verification */
    const user = await UserService.getUserForVerification({ email });
    if (!user) {
      throw new AppError({
        status: 401,
        type: 'Unauthorized',
        message: 'Invalid Credentials!',
        highlight: 'User Not Found!',
      });
    }

    /* Password Verification */
    const isPassVerified = await bcrypt.compare(
      password + env.PASSWORD_PEPPER,
      user.passwordHash as string
    );
    if (!isPassVerified) {
      throw new AppError({
        status: 401,
        type: 'Unauthorized',
        message: 'Invalid Credentials!',
        highlight: 'Credential Mismatch!',
      });
    }

    /* Device Info & IP Info */
    // ToDo-01: Save it to Database to track user's loggedin devices... and easily logout from another devices and more.....
    const device = callBy(req.headers['user-agent'] || '');
    const geo = callFrom(req.ip);
    console.log(`Login user:${user.id}\n`, { device, geo });

    /* Token Generation */
    const jti = crypto.randomBytes(16).toString('hex');
    const token = genrateToken(
      { email, id: user.id },
      { rememberMe, tokenId: jti }
    );

    /* Set JWT Cookie */
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    const response: SuccessResponse = {
      success: true,
      message: 'Logged In successfully.',
      data: {
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
    };
    return res.status(200).json(response);
  } catch (error: unknown) {
    return next(error);
  }
};

const logout = async (
  req: Request<unknown, unknown, LogoutBodySchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { logoutType } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(200)
        .json({ success: true, message: 'Logged out successfully.' });
    }

    let decoded = jwt.verify(token, env.JWT_SECRET) as DecodedTokenPayload;

    /* *************** Logout *************** */
    if (logoutType === 'self') {
      const timeLeftInSeconds = decoded.exp - Math.floor(Date.now() / 1000);
      if (timeLeftInSeconds > 0) {
        const redisKey = `blacklist/${decoded.id}/${decoded.jti}`;
        await redisClient.set(redisKey, 'blacklisted', {
          EX: timeLeftInSeconds,
        });
      } // Todo: if database implemented for ToDO-01, also need to delete from database as a active
    } else if (logoutType === 'all') {
      // ToDo Your logic to revoke all tokens
    } else {
      // logoutType === "specific"
      // Todo Your logic to revoke specific tokens
    }

    res.clearCookie('token');
    const response: SuccessResponse = {
      success: true,
      message: 'Logged out successfully.',
      data: {},
    };
    return res.status(200).json(response);
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.clearCookie('token');
      return res
        .status(200)
        .json({ success: true, message: 'Logged out successfully.' });
    }
    return next(error);
  } finally {
    res.clearCookie('token');
  }
};

const UserController = { getUser, getUserById, signup, login, logout };
export default UserController;
