import { Response } from "express";
import { prisma } from "@repo/db";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { SignUpBody, SignInBody } from "../validator/auth";
import { AuthRequest } from "../middleware/auth";

export const signUp = async (
  req: { body: SignUpBody },
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signIn = async (
  req: { body: SignInBody },
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.password) {
      res.status(401).json({
        error: "This account was created with Google. Please sign in with Google.",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      message: "Sign in successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const googleCallback = async (
  req: { user?: any },
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth?error=google_auth_failed`);
      return;
    }

    const { id, emails, displayName, photos } = req.user;
    const email = emails?.[0]?.value;

    if (!email) {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth?error=email_not_provided`);
      return;
    }

    // Find or create user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user;

    if (!existingUser) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          googleId: id,
          name: displayName || null,
          image: photos?.[0]?.value || null,
          isVerified: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
        },
      });
    } else {
      // Update existing user with Google info if not already set
      if (!existingUser.googleId) {
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleId: id,
            name: existingUser.name || displayName || null,
            image: existingUser.image || photos?.[0]?.value || null,
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            createdAt: true,
          },
        });
      } else {
        // User already exists with Google ID
        user = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
          createdAt: existingUser.createdAt,
        };
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Redirect to frontend /dashboard with token in cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth?error=internal_error`);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "User found",
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
