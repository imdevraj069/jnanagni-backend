import { create } from "zustand"

export const useDashboardStore = create((set) => ({
  categories: [],
  events: [],
  users: [],
  registrations: [],
  stats: {
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalCategories: 0,
  },

  setCategories: (categories) => set({ categories }),
  setEvents: (events) => set({ events }),
  setUsers: (users) => set({ users }),
  setRegistrations: (registrations) => set({ registrations }),
  setStats: (stats) => set({ stats }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (id, data) =>
    set((state) => ({
      categories: state.categories.map((cat) => (cat._id === id ? { ...cat, ...data } : cat)),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat._id !== id),
    })),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  updateEvent: (id, data) =>
    set((state) => ({
      events: state.events.map((evt) => (evt._id === id ? { ...evt, ...data } : evt)),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((evt) => evt._id !== id),
    })),
}))
