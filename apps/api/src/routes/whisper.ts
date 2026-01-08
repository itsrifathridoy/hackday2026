import { Router } from "express";
import {
  createWhisper,
  getWhispers,
  getWhisperById,
  updateWhisper,
  deleteWhisper,
} from "../controller/whisper";
import { validateCreateWhisper, validateUpdateWhisper } from "../validator/whisper";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Create whisper (requires auth)
router.post("/", authenticateToken, validateCreateWhisper, createWhisper);

// Get all whispers (public)
router.get("/", getWhispers);

// Get whisper by ID (public)
router.get("/:id", getWhisperById);

// Update whisper (requires auth and ownership)
router.put("/:id", authenticateToken, validateUpdateWhisper, updateWhisper);

// Delete whisper (requires auth and ownership)
router.delete("/:id", authenticateToken, deleteWhisper);

export default router;
