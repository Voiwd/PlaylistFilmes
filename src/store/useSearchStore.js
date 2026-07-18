import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  searchQuery: '',
  sortBy: 'adicao', // 'adicao', 'lancamento', 'nome'

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),

  // Filter films based on search query
  filterFilms: (films) => {
    const { searchQuery } = useSearchStore.getState();
    if (!searchQuery.trim()) return films;

    const query = searchQuery.toLowerCase();
    return films.filter((film) => {
      const nome = (film.nome || '').toLowerCase();
      const descricao = (film.descricao || '').toLowerCase();
      const adicionadoPor = (film.adicionadoPor || '').toLowerCase();
      const overview = (film.overview || '').toLowerCase();
      const providers = Array.isArray(film.providers)
        ? film.providers.map((provider) => (provider?.name || '')).join(' ').toLowerCase()
        : '';
      const watchmodeTitle = (film.watchmodeTitle || '').toLowerCase();

      return (
        nome.includes(query) ||
        descricao.includes(query) ||
        adicionadoPor.includes(query) ||
        overview.includes(query) ||
        providers.includes(query) ||
        watchmodeTitle.includes(query)
      );
    });
  },

  // Sort films based on sortBy
  sortFilms: (films) => {
    const { sortBy } = useSearchStore.getState();
    const sorted = [...films];

    switch (sortBy) {
      case 'nome':
        sorted.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
        break;
      case 'lancamento':
        sorted.sort((a, b) => {
          const dateA = a.lancamento ? new Date(a.lancamento).getTime() : 0;
          const dateB = b.lancamento ? new Date(b.lancamento).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'adicao':
      default:
        sorted.sort((a, b) => b.criadoEm - a.criadoEm);
    }

    return sorted;
  },
}));
