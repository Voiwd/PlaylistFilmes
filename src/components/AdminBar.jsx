import { useFilmStore } from '../store/useFilmStore';

export default function AdminBar() {
  const { adminMode, toggleAdminMode } = useFilmStore();

  if (!adminMode) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 px-4 font-bold z-50 flex justify-between items-center">
      <span>⚙️ Modo Admin Ativo</span>
      <button
        onClick={toggleAdminMode}
        className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded text-sm"
      >
        Desativar
      </button>
    </div>
  );
}
