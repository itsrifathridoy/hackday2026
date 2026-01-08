import jwt from "jsonwebtoken";
import type { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

// Fallback chain to support both JWT_SECRET and legacy JWT_REFRESH_TOKEN_SECRET
const JWT_SECRET: Secret =
  process.env.JWT_SECRET ??
  process.env.JWT_REFRESH_TOKEN_SECRET ??
  "your-secret-key-change-in-production";
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

export interface JWTPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }
    const payload = decoded as JwtPayload;
    const userId = (payload as any).userId;
    const email = (payload as any).email;
    if (!userId || !email) {
      throw new Error("Invalid token payload");
    }
    return { userId, email };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
