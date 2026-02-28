"use client";

import { useSessionStore } from "@/store/authStore";
import { useEffect } from "react";

export function SessionHydrator({ session }: { session: AuthSession }) {
  const setSession = useSessionStore((s) => s.setSession);

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  return null;
}
