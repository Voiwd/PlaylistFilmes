import { useEffect } from 'react';
import { useFilmStore } from '../../store/useFilmStore';

function formatDate(value) {
  if (!value) return 'Não informado';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('pt-BR');
}

function formatPriceInfo(priceInfo) {
  if (!priceInfo) return 'Sem preço informado';
  return priceInfo.label || 'Sem preço informado';
}

function buildPosterFallback() {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="%231f2937" width="300" height="450"/><text x="50%" y="50%" font-size="16" fill="%234b5563" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Sem Imagem</text></svg>';
}

function dedupeProviders(providers) {
  const seen = new Set();

  return providers.filter((provider) => {
    const key = [
      provider.name || '',
      provider.label || '',
      provider.type || '',
      provider.region || '',
      provider.webUrl || '',
    ].join('|');

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export default function FilmDetailsModal() {
  const { viewingFilm, isFilmDetailsOpen, closeFilmDetails } = useFilmStore();

  useEffect(() => {
    if (!isFilmDetailsOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeFilmDetails();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeFilmDetails, isFilmDetailsOpen]);

  if (!isFilmDetailsOpen || !viewingFilm) return null;

  const posterUrl = viewingFilm.posterUrl || viewingFilm.imagem;
  const synopsis = viewingFilm.overview || viewingFilm.descricao || 'Sem sinopse disponível.';
  const providers = Array.isArray(viewingFilm.providers)
    ? dedupeProviders(viewingFilm.providers.filter(Boolean))
    : [];
  const priceInfo = viewingFilm.priceInfo || null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/75 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-details-title"
      onClick={closeFilmDetails}
    >
      <div
        className="film-details-card relative w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeFilmDetails}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-2xl leading-none text-gray-100 transition hover:bg-black/60"
          aria-label="Fechar detalhes do filme"
        >
          ×
        </button>

        <div className="grid min-h-[min(80vh,900px)] md:grid-cols-[minmax(280px,380px)_1fr]">
          <div className="border-b border-gray-800 bg-gray-950 md:border-b-0 md:border-r">
            <img
              src={posterUrl || 'https://via.placeholder.com/300x450?text=Sem+Imagem'}
              alt={viewingFilm.nome}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = buildPosterFallback();
              }}
            />
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="border-b border-gray-800 px-6 py-5 pr-16 md:px-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                Detalhes do filme
              </p>
              <h2 id="film-details-title" className="mt-2 text-2xl font-bold text-gray-100">
                {viewingFilm.nome}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-300">
                {synopsis}
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 md:px-7">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Lançamento
                  </span>
                  <span className="mt-1 block text-sm text-gray-100">
                    {formatDate(viewingFilm.lancamento)}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Adicionado por
                  </span>
                  <span className="mt-1 block text-sm text-gray-100">
                    {viewingFilm.adicionadoPor || 'Desconhecido'}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    TMDB ID
                  </span>
                  <span className="mt-1 block text-sm text-gray-100">
                    {viewingFilm.tmdbId || 'Não definido'}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Watchmode ID
                  </span>
                  <span className="mt-1 block text-sm text-gray-100">
                    {viewingFilm.watchmodeId || 'Não definido'}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    País / região
                  </span>
                  <span className="mt-1 block text-sm text-gray-100">
                    {viewingFilm.country || 'Não informado'}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Preço
                  </span>
                  <span className="mt-1 block text-sm text-gray-100">
                    {formatPriceInfo(priceInfo)}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Onde assistir
                  </p>
                  {viewingFilm.watchmodeUrl ? (
                    <a
                      href={viewingFilm.watchmodeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                    >
                      Abrir fonte
                    </a>
                  ) : null}
                </div>

                {providers.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {providers.map((provider) => (
                      <span
                        key={`${provider.sourceId || provider.name}-${provider.region || 'global'}`}
                        className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-200"
                        title={provider.label || provider.name}
                      >
                        {provider.name}
                        {provider.label ? ` · ${provider.label}` : ''}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">
                    Sem disponibilidade encontrada.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
