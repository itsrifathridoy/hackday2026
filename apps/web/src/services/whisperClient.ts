import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001/api";

// Create axios instance for whisper API
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Mood = "happy" | "sad" | "calm" | "angry" | "excited" | "tired";

export interface Whisper {
  id: string;
  mood: Mood | null;
  photoUrl?: string | null;
  audioUrl?: string | null;
  caption?: string | null;
  emoji?: string | null;
  author: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
  reactions?: {
    love: number;
    calm: number;
    sad: number;
    angry: number;
    rainbow: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateWhisperData {
  photoUrl?: string;
  audioUrl?: string;
  caption?: string;
  emoji?: string;
}

export interface UpdateWhisperData {
  photoUrl?: string;
  audioUrl?: string;
  caption?: string;
  emoji?: string;
}

const whisperClient = {
  // Get all whispers
  async getWhispers(): Promise<Whisper[]> {
    const response = await apiClient.get("/whispers");
    return response.data.data;
  },

  // Get whisper by ID
  async getWhisperById(id: string): Promise<Whisper> {
    const response = await apiClient.get(`/whispers/${id}`);
    return response.data.data;
  },

  // Create whisper
  async createWhisper(data: CreateWhisperData): Promise<Whisper> {
    const response = await apiClient.post("/whispers", data);
    return response.data.data;
  },

  // Update whisper
  async updateWhisper(id: string, data: UpdateWhisperData): Promise<Whisper> {
    const response = await apiClient.put(`/whispers/${id}`, data);
    return response.data.data;
  },

  // Delete whisper
  async deleteWhisper(id: string): Promise<void> {
    await apiClient.delete(`/whispers/${id}`);
  },
};

export default whisperClient;
