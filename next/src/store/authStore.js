import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // The user object
  isAuthenticated: false,
  isAuthModalOpen: false,
  modalView: 'login', // 'login' | 'register' | 'forgot'

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  // UI Actions
  openModal: (view = 'login') => set({ isAuthModalOpen: true, modalView: view }),
  closeModal: () => set({ isAuthModalOpen: false }),
  setModalView: (view) => set({ modalView: view }),
}));