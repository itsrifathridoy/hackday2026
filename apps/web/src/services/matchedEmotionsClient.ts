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

export interface MatchedEmotion {
  id: string;
  name: string;
  image: string | null;
  mood: string | null;
  emoji: string | null;
  whisperId: string;
  createdAt: string;
}

const matchedEmotionsClient = {
  // Get matched emotions
  async getMatchedEmotions(mood?: string): Promise<MatchedEmotion[]> {
    const params = mood ? { mood } : {};
    const response = await apiClient.get("/matched-emotions", { params });
    return response.data.data;
  },
};

export default matchedEmotionsClient;
