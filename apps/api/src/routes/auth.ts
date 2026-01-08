import { Router } from "express";
import passport from "../middleware/passport";
import { signUp, signIn, googleCallback, getMe } from "../controller/auth";
import { validateSignUp, validateSignIn } from "../validator/auth";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Email/Password authentication
router.post("/signup", validateSignUp, signUp);
router.post("/signin", validateSignIn, signIn);

// Get current user
router.get("/me", authenticateToken, getMe);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/google/failure",
  }),
  googleCallback
);

router.get("/google/failure", (req, res) => {
  res.status(401).json({ error: "Google authentication failed" });
});

export default router;
