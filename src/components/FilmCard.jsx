import { useState } from 'react';
import { useFilmStore } from '../store/useFilmStore';
import { deleteFilm } from '../services/firebaseService';

function formatWatchmodePriceInfo(priceInfo) {
  if (!priceInfo?.label) return '';
  return priceInfo.label;
}

export default function FilmCard({ film }) {
  const { adminMode, openEditModal } = useFilmStore();
  const [deleting, setDeleting] = useState(false);

  const posterUrl = film.posterUrl || film.imagem;
  const synopsis = film.overview || film.descricao || '';
  const providers = Array.isArray(film.providers) ? film.providers.filter(Boolean) : [];
  const topProviders = providers.slice(0, 3);
  const priceInfo = film.priceInfo || null;

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
    <div className="film-card w-full overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-lg">
      <img
        src={posterUrl || 'https://via.placeholder.com/300x450?text=Sem+Imagem'}
        alt={film.nome}
        className="w-full aspect-[2/3] object-cover bg-gray-800"
        onError={(event) => {
          event.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="%231f2937" width="300" height="450"/><text x="50%" y="50%" font-size="16" fill="%234b5563" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Sem Imagem</text></svg>';
        }}
      />

      <div className="space-y-2 p-3">
        <div>
          <h3 className="truncate text-sm font-bold text-gray-100">{film.nome}</h3>
          {film.tmdbId && (
            <p className="mt-1 text-[11px] uppercase tracking-wide text-cyan-200/80">
              TMDB {film.tmdbId}
            </p>
          )}
        </div>

        {synopsis && (
          <p className="line-clamp-3 text-xs leading-5 text-gray-400">{synopsis}</p>
        )}

        <div className="space-y-1.5">
          {film.lancamento && (
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-300">Lançamento:</span>{' '}
              {new Date(film.lancamento).toLocaleDateString('pt-BR')}
            </p>
          )}

          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-300">Por:</span>{' '}
            {film.adicionadoPor || 'Desconhecido'}
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Onde assistir
          </p>

          {providers.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {topProviders.map((provider) => (
                <span
                  key={`${provider.sourceId || provider.name}-${provider.region || 'global'}`}
                  className="rounded-full border border-gray-700 bg-gray-800 px-2 py-1 text-[11px] text-gray-200"
                  title={provider.label || provider.name}
                >
                  {provider.name}
                  {provider.label ? ` · ${provider.label}` : ''}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-gray-500">Sem disponibilidade encontrada.</p>
          )}

          {priceInfo?.label && (
            <p className="mt-2 text-xs text-emerald-200">
              <span className="font-semibold text-emerald-300">Preço:</span>{' '}
              {formatWatchmodePriceInfo(priceInfo)}
            </p>
          )}

          {film.country && (
            <p className="mt-1 text-[11px] text-gray-600">
              Região: {film.country}
            </p>
          )}
        </div>

        {adminMode && (
          <div className="admin-section flex gap-2 border-t border-gray-800 pt-2">
            <button onClick={() => openEditModal(film)} className="admin-btn flex-1">
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
