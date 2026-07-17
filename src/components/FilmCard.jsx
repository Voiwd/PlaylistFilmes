import { useState } from 'react';
import { useFilmStore } from '../store/useFilmStore';
import { deleteFilm } from '../services/firebaseService';

export default function FilmCard({ film }) {
  const { adminMode, openEditModal } = useFilmStore();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que quer apagar este filme?')) return;
    try {
      setDeleting(true);
      await deleteFilm(film.id);
    } catch (error) {
      console.error('Error deleting film:', error);
      alert('Erro ao apagar filme');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="film-card w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800">
      <img
        src={film.imagem}
        alt={film.nome}
        className="w-full aspect-[2/3] object-cover bg-gray-800"
        onError={(e) => {
          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="%231f2937" width="300" height="450"/><text x="50%" y="50%" font-size="16" fill="%234b5563" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Sem Imagem</text></svg>';
        }}
      />

      <div className="p-2 text-center">
        <h3 className="text-sm font-bold truncate text-gray-100">{film.nome}</h3>

        {film.descricao && (
          <p className="text-xs text-gray-400 line-clamp-2 mt-1">{film.descricao}</p>
        )}

        {film.lancamento && (
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-semibold">Lançamento:</span> {new Date(film.lancamento).toLocaleDateString('pt-BR')}
          </p>
        )}

        <p className="text-xs text-gray-500 mt-1">
          <span className="font-semibold">Por:</span> {film.adicionadoPor || 'Desconhecido'}
        </p>

        {adminMode && (
          <div className="admin-section mt-2 pt-2 border-t border-gray-800">
            <button
              onClick={() => openEditModal(film)}
              className="admin-btn flex-1 mr-2"
            >
              ✏️ Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="admin-btn flex-1 disabled:opacity-50"
            >
              {deleting ? '...' : '🗑️ Apagar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
