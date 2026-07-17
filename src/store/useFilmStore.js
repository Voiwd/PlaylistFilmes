import { create } from 'zustand';

export const useFilmStore = create((set) => ({
  films: [],
  adminMode: false,
  editingFilm: null,
  isEditModalOpen: false,
  isPasswordModalOpen: false,

  // Actions for films
  setFilms: (films) => set({ films }),
  addFilm: (film) => set((state) => ({ films: [...state.films, film] })),
  updateFilm: (id, updates) =>
    set((state) => ({
      films: state.films.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  removeFilm: (id) =>
    set((state) => ({
      films: state.films.filter((f) => f.id !== id),
    })),

  // Admin mode
  toggleAdminMode: () =>
    set((state) => ({
      adminMode: !state.adminMode,
      editingFilm: null,
      isEditModalOpen: false,
    })),

  openPasswordModal: () =>
    set({
      isPasswordModalOpen: true,
    }),

  closePasswordModal: () =>
    set({
      isPasswordModalOpen: false,
    }),

  // Edit modal
  openEditModal: (film) =>
    set({
      editingFilm: film,
      isEditModalOpen: true,
    }),
  closeEditModal: () =>
    set({
      editingFilm: null,
      isEditModalOpen: false,
    }),
}));
