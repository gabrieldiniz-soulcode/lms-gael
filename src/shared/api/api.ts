import { StoredUser } from "@/contexts/AuthContext";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({ baseURL, timeout: 10000 });

api.interceptors.request.use(
  async (config) => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const stored: StoredUser | null = storedUser ? JSON.parse(storedUser) : null;
    if (!!stored?.user?.token) config.headers.Authorization = `Bearer ${stored.user.token}`;
    return config;
  }, async (error) => {
    console.log(error, "Erro na requisição");
    return Promise.reject(error);
  });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error, "Erro na resposta");
    return Promise.reject(error);
  }
);