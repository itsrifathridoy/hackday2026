import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type ReactionType = "love" | "calm" | "sad" | "angry" | "rainbow";

export interface ReactionCounts {
  love: number;
  calm: number;
  sad: number;
  angry: number;
  rainbow: number;
}

const reactionClient = {
  // Get reactions for a whisper
  async getReactions(whisperId: string): Promise<ReactionCounts> {
    const response = await apiClient.get(`/reactions/whisper/${whisperId}`);
    return response.data.data;
  },

  // Add reaction
  async addReaction(whisperId: string, type: ReactionType): Promise<ReactionCounts> {
    const response = await apiClient.post(`/reactions/whisper/${whisperId}`, { type });
    return response.data.data.counts;
  },

  // Remove reaction
  async removeReaction(whisperId: string, type: ReactionType): Promise<ReactionCounts> {
    const response = await apiClient.delete(`/reactions/whisper/${whisperId}`, {
      data: { type },
    });
    return response.data.data.counts;
  },
};

export default reactionClient;
