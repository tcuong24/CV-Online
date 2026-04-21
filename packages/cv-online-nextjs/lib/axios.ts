import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9999/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // ← lấy từ NextAuth thay vì localStorage
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear NextAuth session and redirect to login
        await signOut({ callbackUrl: "/auth", redirect: true });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;