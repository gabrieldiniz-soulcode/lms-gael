"use client";

import { addDoc, collection } from "firebase/firestore";

import { StoredUser } from "@/contexts/AuthContext";
import axios from "axios";
import { db } from "@/lib/firebaseConfig";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

let updateResponsesFn: (() => void) | null = null;

export function registerUpdateResponses(fn: () => void) {
  updateResponsesFn = fn;
}

const trackerUserToFirebase = async (error: unknown, type: "request" | "response") => {
  updateResponsesFn?.();

  try {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const stored: StoredUser | null = storedUser ? JSON.parse(storedUser) : null;

    const payload = {
      type,
      timestamp: new Date().toISOString(),
      action: "",
      user: stored ? stored.user : null,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      origin: typeof window !== "undefined" ? window.location.href : null,
    };

    await addDoc(collection(db, "tracker_user"), payload);
  } catch (logErr) {
    console.error("Falha ao salvar log de erro no Firebase", logErr);
  }
};
export const api = axios.create({ baseURL, timeout: 10000 });

api.interceptors.request.use(
  async (config) => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const stored: StoredUser | null = storedUser ? JSON.parse(storedUser) : null;
    if (!!stored?.user?.token) config.headers.Authorization = `Bearer ${stored.user.token}`;
    return config;
  }, async (error) => {
    await trackerUserToFirebase(error, "request");
    return Promise.reject(error);
  });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    await trackerUserToFirebase(error, "response");
    return Promise.reject(error);
  }
);