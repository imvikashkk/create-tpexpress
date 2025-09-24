import * as z from "zod";
import mongoose from "mongoose";
/* User Creation */
const userCreateBodySchema = z.object({
  fname: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .regex(/^[a-zA-Z\s]*$/, "First Name can only contain letters and spaces.")
    .refine((name) => name.split(" ").some((word) => word.length >= 2), {
      message: "Name must contain at least one word with 2 or more characters.",
    }),
  lname: z
    .string()
    .trim()
    .regex(/^[A-Za-z]+$/, "Last Name can only contain letters.")
    .optional(),
  email: z.string().trim().toLowerCase().email("Invalid email address."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."
    ),
});

/* Get Users with Query  */
const usersQuerySchema = z.object({
  limit: z.coerce
    .number("limit must be a number")
    .min(1, "minimum limit query should be 1")
    .max(100, "maximum limit query should be 100")
    .optional(),

  skip: z.coerce
    .number("skip must be a number")
    .min(1, "minimum skip query should be 1")
    .optional(),
});

/* Get User By ID */
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid User Id.",
  });

const userByIdParamSchema = z.object({
  id: objectId,
});

/* Login User */
const loginBodySchema = z.object({
  email: z
    .string("Invalid Credentials!")
    .trim()
    .toLowerCase()
    .email("Invalid Credentials!"),
  password: z.string("Invalid Credentials!").trim(),
  rememberMe: z.boolean("Request Error!").default(false),
});

/* Logout User */
const jtiObjectSchema = z.object({
  jti: z.string().uuid(),
});

// Main schema to handle all logout scenarios
const logoutBodySchema = z.object({
  // The 'logoutType' property is optional and defaults to 'self'
  logoutType: z.enum(["self", "specific", "all"]).default("self"),

  // These properties are optional and are used only for specific logout types
  jtis: z.array(jtiObjectSchema).optional(),
  logoutAll: z.literal(true).optional(),
});

export {
  userCreateBodySchema,
  userByIdParamSchema,
  usersQuerySchema,
  loginBodySchema,
  logoutBodySchema,
};

/* Export Types */
export type UserCreateBodySchema = z.infer<typeof userCreateBodySchema>;
export type UserByIdParamSchema = z.infer<typeof userByIdParamSchema>;
export type UsersQuerySchema = z.infer<typeof usersQuerySchema>;
export type LoginBodySchema = z.infer<typeof loginBodySchema>;
export type LogoutBodySchema = z.infer<typeof logoutBodySchema>;
