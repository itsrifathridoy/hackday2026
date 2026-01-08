import { Response } from "express";
import { prisma } from "@repo/db";
import { AuthRequest } from "../middleware/auth";

export const getMatchedEmotions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { mood } = req.query;

    if (!mood || typeof mood !== "string") {
      res.status(400).json({ error: "Mood parameter is required" });
      return;
    }

    // Get current user's latest whisper to determine their mood
    const userWhisper = await prisma.whisper.findFirst({
      where: { authorId: req.userId },
      orderBy: { createdAt: "desc" },
      select: { mood: true },
    });

    const targetMood = mood || userWhisper?.mood;

    if (!targetMood) {
      res.json({
        message: "No matched emotions found",
        data: [],
      });
      return;
    }

    // Find other users who have whispers with the same mood
    // Exclude the current user
    const matchedWhispers = await prisma.whisper.findMany({
      where: {
        mood: targetMood,
        authorId: {
          not: req.userId,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to 10 matches
      distinct: ["authorId"], // Get unique users
    });

    // Format response
    const matches = matchedWhispers.map((whisper) => ({
      id: whisper.author.id,
      name: whisper.author.name || whisper.author.email,
      image: whisper.author.image,
      mood: whisper.mood,
      emoji: whisper.emoji,
      whisperId: whisper.id,
      createdAt: whisper.createdAt,
    }));

    res.json({
      message: "Matched emotions fetched successfully",
      data: matches,
    });
  } catch (error) {
    console.error("Get matched emotions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
