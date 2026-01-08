import { Response } from "express";
import { prisma } from "@repo/db";
import { CreateWhisperBody, UpdateWhisperBody } from "../validator/whisper";
import { AuthRequest } from "../middleware/auth";
import { generateMood } from "../services/mood";

export const createWhisper = async (
  req: AuthRequest & { body: CreateWhisperBody },
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { photoUrl, audioUrl, caption, emoji } = req.body;

    const { mood, emoji: autoEmoji } = await generateMood({
      caption: caption || null,
      audioUrl: audioUrl || null,
      photoUrl: photoUrl || null,
    });

    const whisper = await prisma.whisper.create({
      data: {
        photoUrl,
        audioUrl,
        caption,
        authorId: req.userId,
        mood,
        emoji: emoji ?? autoEmoji,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Whisper created successfully",
      data: whisper,
    });
  } catch (error) {
    console.error("Create whisper error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWhispers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const whispers = await prisma.whisper.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      message: "Whispers fetched successfully",
      data: whispers,
    });
  } catch (error) {
    console.error("Get whispers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWhisperById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const whisper = await prisma.whisper.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!whisper) {
      res.status(404).json({ error: "Whisper not found" });
      return;
    }

    res.json({
      message: "Whisper fetched successfully",
      data: whisper,
    });
  } catch (error) {
    console.error("Get whisper error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateWhisper = async (
  req: AuthRequest & { body: UpdateWhisperBody },
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id } = req.params;

    // Check if whisper exists and belongs to the user
    const whisper = await prisma.whisper.findUnique({
      where: { id },
    });

    if (!whisper) {
      res.status(404).json({ error: "Whisper not found" });
      return;
    }

    if (whisper.authorId !== req.userId) {
      res.status(403).json({ error: "You can only update your own whispers" });
      return;
    }

    // Optionally regenerate mood if content changed and no explicit emoji was provided
    let newMood: string | undefined;
    let newEmoji: string | undefined = req.body.emoji ?? undefined;
    if ((req.body.caption !== undefined || req.body.photoUrl !== undefined || req.body.audioUrl !== undefined) && req.body.emoji === undefined) {
      const gen = await generateMood({
        caption: req.body.caption ?? whisper.caption ?? null,
        photoUrl: req.body.photoUrl ?? whisper.photoUrl ?? null,
        audioUrl: req.body.audioUrl ?? whisper.audioUrl ?? null,
      });
      newMood = gen.mood;
      newEmoji = gen.emoji;
    }

    const updatedWhisper = await prisma.whisper.update({
      where: { id },
      data: {
        photoUrl: req.body.photoUrl ?? undefined,
        audioUrl: req.body.audioUrl ?? undefined,
        caption: req.body.caption ?? undefined,
        mood: newMood,
        emoji: newEmoji,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    res.json({
      message: "Whisper updated successfully",
      data: updatedWhisper,
    });
  } catch (error) {
    console.error("Update whisper error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteWhisper = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { id } = req.params;

    // Check if whisper exists and belongs to the user
    const whisper = await prisma.whisper.findUnique({
      where: { id },
    });

    if (!whisper) {
      res.status(404).json({ error: "Whisper not found" });
      return;
    }

    if (whisper.authorId !== req.userId) {
      res.status(403).json({ error: "You can only delete your own whispers" });
      return;
    }

    await prisma.whisper.delete({
      where: { id },
    });

    res.json({
      message: "Whisper deleted successfully",
    });
  } catch (error) {
    console.error("Delete whisper error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
