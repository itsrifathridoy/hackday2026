import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Try to get token from Authorization header first
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  // Or try to get from cookies
  const cookieToken = (req.cookies as any)?.auth_token;
  
  const token = bearerToken || cookieToken;

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
