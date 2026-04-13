import { arrayUnion, doc, setDoc } from "firebase/firestore";

import { StoredUser } from "@/contexts/AuthContext";
import { db } from "@/lib/firebaseConfig";

const MAX_PAYLOAD_CHARS = 5000;
export const BLOCKED_URLS = ["/auth"];

export type TrackingEventType = "page_view" | "page_leave" | "click" | "api_request" | "api_response";

export interface TrackingEvent {
  type: TrackingEventType;
  userId?: string;
  userName?: string;
  timestamp: string;
  page: string;
  data: Record<string, unknown>;
}

export function truncate(data: unknown): string {
  try {
    return JSON.stringify(data).slice(0, MAX_PAYLOAD_CHARS);
  } catch {
    return String(data).slice(0, MAX_PAYLOAD_CHARS);
  }
}

function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // formato novo: { user: { token, id, ... }, expiry }
    if (parsed?.user?.token) return parsed as StoredUser;
    // formato antigo: { token, id, ... } direto na raiz
    if (parsed?.token) return { user: parsed as StoredUser["user"], expiry: 0 };
    return null;
  } catch {
    return null;
  }
}

export async function trackEvent(event: TrackingEvent): Promise<void> {
  if (typeof window === "undefined") return;

  // if (process.env.NODE_ENV === "development") {
  //   console.log("[tracking]", event.type, event);
  //   return;
  // }

  try {
    const stored = getStoredUser();
    const userId = String(stored?.user?.id ?? event.userId ?? "anonymous");
    const userName = String(stored?.user?.name ?? event.userName ?? "anonymous");

    const action = {
      type: event.type,
      timestamp: event.timestamp,
      page: event.page,
      data: event.data,
      userAgent: navigator.userAgent,
    };
    await setDoc(
      doc(db, "user_events", String(userId)),
      { userId, userName, actions: arrayUnion(action) },
      { merge: true }
    );
  } catch (err) {
    console.error("[tracking] Falha ao salvar evento", err);
  }
}
