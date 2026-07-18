import { useState } from 'react';
import { useFilmStore } from '../store/useFilmStore';
import { deleteFilm } from '../services/firebaseService';

export default function FilmCard({ film }) {
  const { adminMode, openEditModal, openFilmDetails } = useFilmStore();
  const [deleting, setDeleting] = useState(false);

  const posterUrl = film.posterUrl || film.imagem;
  const synopsis = film.overview || film.descricao || '';

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
    <div
      role="button"
      tabIndex={0}
      onClick={() => openFilmDetails(film)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openFilmDetails(film);
        }
      }}
      className="film-card group w-full max-w-[220px] cursor-pointer overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
    >
      <img
        src={posterUrl || 'https://via.placeholder.com/300x450?text=Sem+Imagem'}
        alt={film.nome}
        className="w-full aspect-[2/3] object-cover bg-gray-800"
        onError={(event) => {
          event.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="%231f2937" width="300" height="450"/><text x="50%" y="50%" font-size="16" fill="%234b5563" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Sem Imagem</text></svg>';
        }}
      />

      <div className="space-y-2 p-2.5">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-gray-100 group-hover:text-white">
            {film.nome}
          </h3>
        </div>

        {synopsis && (
          <p className="line-clamp-2 text-[11px] leading-5 text-gray-400">{synopsis}</p>
        )}

        <div className="space-y-1">
          {film.lancamento && (
            <p className="text-[11px] text-gray-500">
              <span className="font-semibold text-gray-300">Lançamento:</span>{' '}
              {new Date(film.lancamento).toLocaleDateString('pt-BR')}
            </p>
          )}

          <p className="text-[11px] text-gray-500">
            <span className="font-semibold text-gray-300">Por:</span>{' '}
            {film.adicionadoPor || 'Desconhecido'}
          </p>
        </div>

        {adminMode && (
          <div className="admin-section flex gap-2 border-t border-gray-800 pt-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                openEditModal(film);
              }}
              className="admin-btn flex-1"
            >
              ✏️ Editar
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleDelete();
              }}
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
