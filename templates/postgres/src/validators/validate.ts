import {
  RequestHandler,
  Request,
  Response,
  NextFunction,
  ErrorResponse,
} from "express";
import { ZodType, ZodError } from "zod";

/* Validation Type */
type ValidationSchemas = {
  params?: ZodType;
  body?: ZodType;
  query?: ZodType;
};

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      /* If validating to body of request */
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          console.info("aaya1");
          return res.status(400).json(formatZodError(result.error));
        }
        req.body = result.data;
      }

      /* If validating to query parameters of request */
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          return res.status(400).json(formatZodError(result.error));
        }
        res.locals.query = result.data as typeof res.locals;
      }

      /* If validating to parameters of request */
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          return res.status(400).json(formatZodError(result.error));
        }
        res.locals.params = result.data as typeof res.locals;
      }

      return next();
    } catch (error) {
      /* Error */
      return res.status(500).json({
        success: false,
        error: {
          type: "InternalServerError",
          message: "Something went wrong",
          highlight: (error as { message: string }).message || "",
          details: error,
        },
      });
    }
  };
}

function formatZodError(error: ZodError): ErrorResponse {
  return {
    success: false,
    error: {
      type: typeof error.name === "string" ? error.name : "ValidationError",
      message: error.issues?.[0]?.message || "",
      highlight: "Error",
      details:
        error.issues.map((issue) => {
          return { message: issue?.message, path: issue?.path[0] };
        }) || undefined,
    },
  };
}
