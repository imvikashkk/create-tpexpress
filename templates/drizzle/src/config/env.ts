import * as z from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1024).max(65535),
  CORS_ORIGINS: z.string().transform((val) => val.split(",")),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  SESSION_SECRET: z.string(),
  PASSWORD_SALT_ROUNDS: z.coerce.number().int().min(1).max(31),
  PASSWORD_PEPPER: z.string(),
  JWT_SECRET: z.string(),
  JWT_ISSUER: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format);
  process.exit(1);
}

const env = parsedEnv.data;
export default env;
