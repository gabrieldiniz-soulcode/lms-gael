"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);

  if (!user?.isAdmin) return null;

  return <>{children}</>;
}
