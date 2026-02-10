import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Global auth store.
 * We keep the authenticated user here and persist to localStorage so
 * refreshes don't blow away client state. The real auth source of truth
 * is the httpOnly JWT cookie – this store just mirrors user info.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "spendwise-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
