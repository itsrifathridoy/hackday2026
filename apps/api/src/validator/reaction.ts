import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const reactionTypeSchema = z.enum(["love", "calm", "sad", "angry", "rainbow"]);

export const validateAddReaction = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const schema = z.object({
      type: reactionTypeSchema,
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

export const validateRemoveReaction = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const schema = z.object({
      type: reactionTypeSchema,
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
