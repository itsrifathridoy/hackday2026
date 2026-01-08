import { Response } from "express";
import { prisma } from "@repo/db";
import { AuthRequest } from "../middleware/auth";
import { getReactionCountsForWhisper } from "../services/reaction";

const VALID_REACTION_TYPES = ["love", "calm", "sad", "angry", "rainbow"] as const;
type ReactionType = typeof VALID_REACTION_TYPES[number];

export const addReaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { whisperId } = req.params;
    const { type } = req.body;

    if (!type || !VALID_REACTION_TYPES.includes(type as ReactionType)) {
      res.status(400).json({ 
        error: "Invalid reaction type. Must be one of: love, calm, sad, angry, rainbow" 
      });
      return;
    }

    // Check if whisper exists
    const whisper = await prisma.whisper.findUnique({
      where: { id: whisperId },
    });

    if (!whisper) {
      res.status(404).json({ error: "Whisper not found" });
      return;
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        whisperId_userId_type: {
          whisperId,
          userId: req.userId,
          type: type as ReactionType,
        },
      },
    });

    if (existingReaction) {
      res.status(400).json({ error: "Reaction already exists" });
      return;
    }

    // Create reaction
    const reaction = await prisma.reaction.create({
      data: {
        whisperId,
        userId: req.userId,
        type: type as ReactionType,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Get updated reaction counts
    const reactionCounts = await getReactionCountsForWhisper(whisperId);

    res.status(201).json({
      message: "Reaction added successfully",
      data: {
        reaction,
        counts: reactionCounts,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "Reaction already exists" });
      return;
    }
    console.error("Add reaction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeReaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { whisperId } = req.params;
    const { type } = req.body;

    if (!type || !VALID_REACTION_TYPES.includes(type as ReactionType)) {
      res.status(400).json({ 
        error: "Invalid reaction type. Must be one of: love, calm, sad, angry, rainbow" 
      });
      return;
    }

    // Check if reaction exists
    const reaction = await prisma.reaction.findUnique({
      where: {
        whisperId_userId_type: {
          whisperId,
          userId: req.userId,
          type: type as ReactionType,
        },
      },
    });

    if (!reaction) {
      res.status(404).json({ error: "Reaction not found" });
      return;
    }

    // Delete reaction
    await prisma.reaction.delete({
      where: {
        id: reaction.id,
      },
    });

    // Get updated reaction counts
    const reactionCounts = await getReactionCountsForWhisper(whisperId);

    res.json({
      message: "Reaction removed successfully",
      data: {
        counts: reactionCounts,
      },
    });
  } catch (error) {
    console.error("Remove reaction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { whisperId } = req.params;

    const reactionCounts = await getReactionCountsForWhisper(whisperId);

    res.json({
      message: "Reactions fetched successfully",
      data: reactionCounts,
    });
  } catch (error) {
    console.error("Get reactions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
