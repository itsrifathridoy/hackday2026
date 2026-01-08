import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

interface SignUpPayload {
  email: string;
  password: string;
  name?: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
  token: string;
}

class AuthClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach token to every request
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 responses (token expired)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.removeToken();
        }
        return Promise.reject(error);
      }
    );
  }

  signup(payload: SignUpPayload): Promise<AuthResponse> {
    return this.client.post("/api/auth/signup", payload).then((res) => {
      if (res.data.token) {
        this.setToken(res.data.token);
      }
      return res.data;
    });
  }

  signin(payload: SignInPayload): Promise<AuthResponse> {
    return this.client.post("/api/auth/signin", payload).then((res) => {
      if (res.data.token) {
        this.setToken(res.data.token);
      }
      return res.data;
    });
  }

  getMe() {
    return this.client.get("/api/auth/me").then((res) => res.data);
  }

  logout(): Promise<void> {
    return this.client.post("/api/auth/logout").then(() => {
      this.removeToken();
    });
  }

  setToken(token: string): void {
    Cookies.set("auth_token", token, { expires: 7 });
  }

  getToken(): string | null {
    return Cookies.get("auth_token") || null;
  }

  removeToken(): void {
    Cookies.remove("auth_token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authClient = new AuthClient();
