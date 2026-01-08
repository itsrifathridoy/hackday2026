import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const MAX_MESSAGE_LENGTH = 20;

export const validateSendMessage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const schema = z.object({
      whisperId: z.string().min(1),
      receiverId: z.string().min(1),
      content: z.string().min(1).max(MAX_MESSAGE_LENGTH),
    });

    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation failed",
        issues: error.errors,
      });
      return;
    }
    next(error);
  }
};
