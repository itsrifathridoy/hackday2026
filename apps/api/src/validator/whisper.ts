import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const createWhisperSchema = z.object({
  photoUrl: z.string().url().optional().nullable(),
  audioUrl: z.string().url().optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  emoji: z.string().max(8).optional().nullable(),
});

export const updateWhisperSchema = z.object({
  photoUrl: z.string().url().optional().nullable(),
  audioUrl: z.string().url().optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  emoji: z.string().max(8).optional().nullable(),
});

export type CreateWhisperBody = z.infer<typeof createWhisperSchema>;
export type UpdateWhisperBody = z.infer<typeof updateWhisperSchema>;

export const validateCreateWhisper = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validated = createWhisperSchema.parse(req.body);
    
    // At least one of photoUrl or audioUrl must be provided
    if (!validated.photoUrl && !validated.audioUrl) {
      res.status(400).json({
        error: "ValidationError",
        issues: [
          {
            path: ["photoUrl", "audioUrl"],
            message: "At least one of photoUrl or audioUrl is required",
          },
        ],
      });
      return;
    }

    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "ValidationError",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    } else {
      res.status(400).json({ error: "Invalid request body" });
    }
  }
};

export const validateUpdateWhisper = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validated = updateWhisperSchema.parse(req.body);
    
    // At least one of photoUrl or audioUrl must be provided
    if (!validated.photoUrl && !validated.audioUrl && validated.caption === undefined) {
      res.status(400).json({
        error: "ValidationError",
        issues: [
          {
            path: ["body"],
            message: "At least one field must be provided for update",
          },
        ],
      });
      return;
    }

    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "ValidationError",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    } else {
      res.status(400).json({ error: "Invalid request body" });
    }
  }
};
