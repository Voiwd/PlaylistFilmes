import { useSearchStore } from '../store/useSearchStore';

export default function FilterSortBar() {
  const { sortBy, setSortBy } = useSearchStore();

  return (
    <div className="px-6 py-4 bg-slate-900 border-b border-slate-700 flex justify-end">
      <div className="max-w-6xl w-full flex items-center gap-3">
        <label htmlFor="sort" className="font-semibold text-slate-300">
          Ordenar por:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
        >
          <option value="adicao">Data de Adição</option>
          <option value="lancamento">Data de Lançamento</option>
          <option value="nome">Nome (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
