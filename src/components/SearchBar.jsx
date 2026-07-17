import { useSearchStore } from '../store/useSearchStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearchStore();

  return (
    <div className="px-0 py-0">
      <input
        type="text"
        placeholder="🔍 Buscar por nome, descrição ou autor..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 text-sm"
      />
    </div>
  );
}
