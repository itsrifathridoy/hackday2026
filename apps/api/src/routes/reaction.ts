import { Router } from "express";
import {
  addReaction,
  removeReaction,
  getReactions,
} from "../controller/reaction";
import { validateAddReaction, validateRemoveReaction } from "../validator/reaction";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Get reactions for a whisper (public)
router.get("/whisper/:whisperId", getReactions);

// Add reaction (requires auth)
router.post("/whisper/:whisperId", authenticateToken, validateAddReaction, addReaction);

// Remove reaction (requires auth)
router.delete("/whisper/:whisperId", authenticateToken, validateRemoveReaction, removeReaction);

export default router;
