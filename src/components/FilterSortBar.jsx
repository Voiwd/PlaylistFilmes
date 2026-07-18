import { useSearchStore } from '../store/useSearchStore';
import { useFilmStore } from '../store/useFilmStore';

export default function FilterSortBar() {
  const { searchQuery, setSearchQuery, sortBy, setSortBy } = useSearchStore();
  const { films } = useFilmStore();

  const totalFilmes = films.length;
  const totalVisiveis = useSearchStore.getState().filterFilms(films).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          Filmes: {totalFilmes} total · {totalVisiveis} visíveis
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="🔍 Buscar por nome, descrição ou autor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full flex-1 px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 text-sm"
        />
        
        <div className="flex items-center gap-2 min-w-max">
          <label htmlFor="sort" className="font-semibold text-gray-300 text-sm whitespace-nowrap">
            Ordenar:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 cursor-pointer text-sm"
          >
            <option value="adicao">Data de Adição</option>
            <option value="lancamento">Data de Lançamento</option>
            <option value="nome">Nome (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
