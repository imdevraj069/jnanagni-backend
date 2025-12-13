import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  // Set user data (called after login or session check)
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // Clear user data
  logout: () => set({ user: null, isAuthenticated: false }),
}));