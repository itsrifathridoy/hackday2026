import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./middleware/passport";
import authRoutes from "./routes/auth";
import whisperRoutes from "./routes/whisper";
import reactionRoutes from "./routes/reaction";
import matchedEmotionsRoutes from "./routes/matchedEmotions";
import messageRoutes from "./routes/message";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cookieParser())
    .use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    }))
    .use(passport.initialize())
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .use("/api/auth", authRoutes)
    .use("/api/whispers", whisperRoutes)
    .use("/api/reactions", reactionRoutes)
    .use("/api/matched-emotions", matchedEmotionsRoutes)
    .use("/api/messages", messageRoutes);

  return app;
};
