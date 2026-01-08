import { Router } from "express";
import { getMatchedEmotions } from "../controller/matchedEmotions";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Get matched emotions (requires auth)
router.get("/", authenticateToken, getMatchedEmotions);

export default router;
