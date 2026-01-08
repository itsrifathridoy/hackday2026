import { ZodError as ZodSchemaError } from "zod";
import type { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const isZodLike = (e: any) => {
  return (
    e &&
    typeof e === "object" &&
    (e instanceof ZodSchemaError || e?.name === "ZodError" || Array.isArray(e?.issues))
  );
};

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    console.log(`Error: ${req.method} ${req.url} - ${err.message}`);
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }
  if (isZodLike(err)) {
    console.log(`ZodError: ${req.method} ${req.url} - ${err.message}`);
    return res.status(422).json({
      status: "error",
      message: (err as any).issues?.[0]?.message || "Validation error",
      details: (err as any).issues?.map((issue: any) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
        expected: (issue as any).expected,
        received: (issue as any).received,
      })),
    });
  }

  // Prisma known request errors (avoid direct import; check shape)
  const anyErr: any = err as any;
  if (anyErr && typeof anyErr === "object" && typeof anyErr.code === "string" && anyErr.clientVersion) {
    console.log(`PrismaError: ${req.method} ${req.url} - ${anyErr.code} ${anyErr.message}`);
    if (anyErr.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "Unique constraint failed",
        details: anyErr.meta,
      });
    }
    if (anyErr.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Record not found",
        details: anyErr.meta,
      });
    }
    return res.status(400).json({
      status: "error",
      message: "Database error",
      code: anyErr.code,
      details: anyErr.meta,
    });
  }

  if (err instanceof TokenExpiredError) {
    console.log(`TokenExpiredError: ${req.method} ${req.url} - ${err.message}`);

    return res.status(401).json({
      status: "error",
      message: "Access token has expired",
      details: "Please refresh your session or login again",
      code: "TOKEN_EXPIRED",
    });
  }
  if (err instanceof JsonWebTokenError) {
    console.log(`JsonWebTokenError: ${req.method} ${req.url} - ${err.message}`);
    return res.status(401).json({
      status: "error",
      message: "Invalid authentication token",
      details: "Please login again to continue",
      code: "TOKEN_INVALID",
    });
  }

  console.log("Unhandled Error: ", err);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    details: "Something went wrong, please try again",
  });
};

export const jsonParseErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "Invalid JSON format",
      details: "Please ensure your request body contains valid JSON",
    });
  }

  return next(new ValidationError("JSON syntax error"));
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode: number, isOperational: boolean = true, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resources Not Found") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}
export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}
export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}
export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service Unavailable") {
    super(message, 503);
  }
}
export class ValidationError extends AppError {
  constructor(message: string = "Validation Error", details?: any) {
    super(message, 422, true, details);
  }
}
export class RateLimitError extends AppError {
  constructor(message: string = "Too Many Requests, please try again later") {
    super(message, 429);
  }
}
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication Error") {
    super(message, 401);
  }
}
export class OTPNotVerified extends AppError {
  constructor(message: string = "OTP Not Verified") {
    super(message, 301);
  }
}
export class DatabaseError extends AppError {
  constructor(message: string = "Database Error") {
    super(message, 500);
  }
}

export class TokenExpired extends AppError {
  constructor(message: string = "Token Expired") {
    super(message, 401);
  }
}

export class ZodError extends AppError {
  constructor(message: string = "Validation Error", details?: any) {
    super(message, 422, true, details);
  }
}
