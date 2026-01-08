import { Response } from "express";
import { prisma } from "@repo/db";
import { AuthRequest } from "../middleware/auth";
import type { Message as PrismaMessage } from "@prisma/client";

const MAX_MESSAGE_LENGTH = 20;

export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { whisperId, receiverId, content } = req.body;

    if (!whisperId || !receiverId || !content) {
      res.status(400).json({ 
        error: "whisperId, receiverId, and content are required" 
      });
      return;
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ 
        error: `Message content must be ${MAX_MESSAGE_LENGTH} characters or less` 
      });
      return;
    }

    // Verify whisper exists
    const whisper = await prisma.whisper.findUnique({
      where: { id: whisperId },
    });

    if (!whisper) {
      res.status(404).json({ error: "Whisper not found" });
      return;
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      res.status(404).json({ error: "Receiver not found" });
      return;
    }

    // Verify sender is not the receiver
    if (req.userId === receiverId) {
      res.status(400).json({ error: "Cannot send message to yourself" });
      return;
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        whisperId,
        senderId: req.userId,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        whisper: {
          select: {
            id: true,
            mood: true,
            emoji: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { whisperId, otherUserId } = req.query;

    if (!whisperId || !otherUserId) {
      res.status(400).json({ 
        error: "whisperId and otherUserId query parameters are required" 
      });
      return;
    }

    // Get messages between current user and other user for this whisper
    const messages = await prisma.message.findMany({
      where: {
        whisperId: whisperId as string,
        OR: [
          {
            senderId: req.userId,
            receiverId: otherUserId as string,
          },
          {
            senderId: otherUserId as string,
            receiverId: req.userId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        receiverId: req.userId,
        readAt: null,
        whisperId: whisperId as string,
        senderId: otherUserId as string,
      },
      data: {
        readAt: new Date(),
      },
    });

    res.json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Get all unique conversations (grouped by whisper and other user)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.userId },
          { receiverId: req.userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        whisper: {
          select: {
            id: true,
            mood: true,
            emoji: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group by whisper and other user
    const conversationsMap = new Map<string, any>();

    messages.forEach((msg) => {
      const otherUser = msg.senderId === req.userId ? msg.receiver : msg.sender;
      const key = `${msg.whisperId}-${otherUser.id}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          whisperId: msg.whisperId,
          whisper: msg.whisper,
          otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      const conv = conversationsMap.get(key);
      if (msg.receiverId === req.userId && !msg.readAt) {
        conv.unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({
      message: "Conversations fetched successfully",
      data: conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
