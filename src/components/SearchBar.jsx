import { useSearchStore } from '../store/useSearchStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearchStore();

  return (
    <div className="px-6 py-4 bg-slate-900 border-b border-slate-700">
      <div className="max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="🔍 Buscar por nome, descrição ou autor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>
    </div>
  );
}
