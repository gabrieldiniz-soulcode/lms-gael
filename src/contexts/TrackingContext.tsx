"use client";

import { createContext, useContext, useEffect, useRef } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/trackingService";
import { usePathname } from "next/navigation";

export const TrackingContext = createContext({});

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const entryTimeRef = useRef<number>(Date.now());

  // Rastreia visitas e tempo por página
  useEffect(() => {
    if (pathname === prevPathRef.current) return;

    // Dispara page_leave para a página anterior com duração
    if (prevPathRef.current !== null) {
      const duration_ms = Date.now() - entryTimeRef.current;
      void trackEvent({
        type: "page_leave",
        userId: user?.id,
        userName: user?.name,
        timestamp: new Date().toISOString(),
        page: prevPathRef.current,
        data: { duration_ms },
      });
    }

    entryTimeRef.current = Date.now();
    prevPathRef.current = pathname;

    void trackEvent({
      type: "page_view",
      userId: user?.id,
      userName: user?.name,
      timestamp: new Date().toISOString(),
      page: pathname,
      data: {
        referrer: typeof document !== "undefined" ? document.referrer : "",
      },
    });
  }, [pathname, user]);

  // Dispara page_leave ao fechar/sair da aba
  useEffect(() => {
    function handleUnload() {
      const duration_ms = Date.now() - entryTimeRef.current;
      void trackEvent({
        type: "page_leave",
        userId: user?.id,
        userName: user?.name,
        timestamp: new Date().toISOString(),
        page: pathname,
        data: { duration_ms },
      });
    }

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [pathname, user]);

  // Rastreia cliques
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a, [role=button], [data-track]") as HTMLElement | null;
      const el = clickable ?? target;

      void trackEvent({
        type: "click",
        userId: user?.id,
        userName: user?.name,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        data: {
          tag: el.tagName,
          text: el.textContent?.trim().slice(0, 100) ?? "",
          href: (el as HTMLAnchorElement).href ?? null,
          id: el.id || null,
          className: el.className || null,
          x: e.clientX,
          y: e.clientY,
        },
      });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [user]);

  return (
    <TrackingContext.Provider value={{}}>
      {children}
    </TrackingContext.Provider>
  );
}
