import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Zod Schemas
export const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
});

export const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Inferred Types
export type SignUpBody = z.infer<typeof SignUpSchema>;
export type SignInBody = z.infer<typeof SignInSchema>;

// Generic validator helper
const validate = <T extends z.ZodTypeAny>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      // attach parsed values back to req.body to ensure downstream type-safety
      (req as any).body = parsed;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "ValidationError",
          issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        });
      }
      return res.status(400).json({ error: "Invalid request payload" });
    }
  };

// Route middlewares
export const validateSignUp = validate(SignUpSchema);
export const validateSignIn = validate(SignInSchema);
