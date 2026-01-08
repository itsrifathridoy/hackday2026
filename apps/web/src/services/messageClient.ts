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

export interface Message {
  id: string;
  whisperId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string | null;
    image: string | null;
  };
  whisper?: {
    id: string;
    mood: string | null;
    emoji: string | null;
  };
}

export interface Conversation {
  whisperId: string;
  whisper: {
    id: string;
    mood: string | null;
    emoji: string | null;
  };
  otherUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  lastMessage: Message;
  unreadCount: number;
}

const messageClient = {
  // Send message
  async sendMessage(
    whisperId: string,
    receiverId: string,
    content: string
  ): Promise<Message> {
    const response = await apiClient.post("/messages", {
      whisperId,
      receiverId,
      content,
    });
    return response.data.data;
  },

  // Get messages between users for a whisper
  async getMessages(
    whisperId: string,
    otherUserId: string
  ): Promise<Message[]> {
    const response = await apiClient.get("/messages", {
      params: { whisperId, otherUserId },
    });
    return response.data.data;
  },

  // Get all conversations
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get("/messages/conversations");
    return response.data.data;
  },
};

export default messageClient;
