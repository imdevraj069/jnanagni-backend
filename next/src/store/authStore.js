import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  
  // Views: 'login' | 'register' | 'forgot' | 'verify_otp'
  modalView: 'login', 
  
  // To store email during the reset flow
  resetEmail: '', 

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  openModal: (view = 'login') => set({ isAuthModalOpen: true, modalView: view }),
  closeModal: () => set({ isAuthModalOpen: false, resetEmail: '' }), // Clear email on close
  
  setModalView: (view) => set({ modalView: view }),
  setResetEmail: (email) => set({ resetEmail: email }), // Action to save email
}));