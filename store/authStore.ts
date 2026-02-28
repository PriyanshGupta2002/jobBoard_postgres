import { create } from "zustand";

interface SessionState {
  session: AuthSession;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
