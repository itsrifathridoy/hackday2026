import { Router } from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controller/message";
import { validateSendMessage } from "../validator/message";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Get all conversations for current user (requires auth)
router.get("/conversations", authenticateToken, getConversations);

// Get messages between users for a specific whisper (requires auth)
router.get("/", authenticateToken, getMessages);

// Send message (requires auth)
router.post("/", authenticateToken, validateSendMessage, sendMessage);

export default router;
