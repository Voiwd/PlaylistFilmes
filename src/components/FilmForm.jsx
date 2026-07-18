import { useEffect, useRef, useState } from 'react';
import { addFilm } from '../services/firebaseService';
import { enrichMovieFromTmdb, searchMoviesForForm } from '../services/movieDiscoveryService';

const defaultCountry = import.meta.env.APP_DEFAULT_COUNTRY?.trim() || 'BR';

const initialFormData = {
  nome: '',
  imagem: '',
  descricao: '',
  lancamento: '',
  adicionadoPor: '',
};

export default function FilmForm({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');
  const searchAbortRef = useRef(null);
  const selectionAbortRef = useRef(null);

  const resetForm = () => {
    searchAbortRef.current?.abort();
    selectionAbortRef.current?.abort();
    searchAbortRef.current = null;
    selectionAbortRef.current = null;
    setSearchQuery('');
    setSearchResults([]);
    setSelectedMovie(null);
    setFormData(initialFormData);
    setSearchLoading(false);
    setSelectionLoading(false);
    setSaving(false);
    setError('');
    setSearchError('');
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const trimmedQuery = searchQuery.trim();

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }

    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError('');
      return undefined;
    }

    const controller = new AbortController();
    searchAbortRef.current = controller;

    const timer = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        setSearchError('');

        const results = await searchMoviesForForm(trimmedQuery, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setSearchResults(results.slice(0, 6));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          setSearchError('Não consegui buscar no TMDB agora.');
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, searchQuery]);

  const syncFormFromMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      nome: movie.nome || '',
      imagem: movie.posterUrl || movie.imagem || '',
      descricao: movie.overview || movie.descricao || '',
      lancamento: movie.releaseDate || movie.lancamento || '',
      adicionadoPor: formData.adicionadoPor || '',
    });
  };

  const handlePickMovie = async (movie) => {
    if (!movie) return;

    setError('');
    setSearchError('');
    setSelectionLoading(true);

    if (selectionAbortRef.current) {
      selectionAbortRef.current.abort();
    }

    const controller = new AbortController();
    selectionAbortRef.current = controller;

    try {
      const enrichedMovie = await enrichMovieFromTmdb(movie, {
        signal: controller.signal,
        country: defaultCountry,
      });

      if (controller.signal.aborted) return;

      syncFormFromMovie(enrichedMovie);
      setSearchQuery(enrichedMovie.nome || movie.nome || '');
      setSearchResults([]);
    } catch (err) {
      if (controller.signal.aborted) return;

      console.error(err);
      setError('Não consegui enriquecer esse filme. Tente outro resultado.');
    } finally {
      if (!controller.signal.aborted) {
        setSelectionLoading(false);
      }
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    if (selectedMovie && value.trim().toLowerCase() !== selectedMovie.nome?.trim().toLowerCase()) {
      setSelectedMovie(null);
    }
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!selectedMovie) {
      setError('Escolha um filme do TMDB antes de salvar.');
      return;
    }

    if (!formData.nome.trim()) {
      setError('O nome do filme é obrigatório.');
      return;
    }

    try {
      setSaving(true);

      await addFilm({
        nome: formData.nome.trim(),
        imagem: formData.imagem.trim() || selectedMovie.posterUrl || '',
        posterUrl: selectedMovie.posterUrl || formData.imagem.trim() || '',
        posterPath: selectedMovie.posterPath || '',
        descricao: formData.descricao.trim() || selectedMovie.overview || '',
        overview: formData.descricao.trim() || selectedMovie.overview || '',
        lancamento: formData.lancamento || selectedMovie.releaseDate || '',
        adicionadoPor: formData.adicionadoPor.trim() || 'Anônimo',
        tmdbId: selectedMovie.tmdbId || '',
        watchmodeId: selectedMovie.watchmodeId || '',
        watchmodeTitle: selectedMovie.watchmodeTitle || '',
        watchmodeUrl: selectedMovie.watchmodeUrl || '',
        providers: selectedMovie.providers || [],
        priceInfo: selectedMovie.priceInfo || null,
        country: selectedMovie.country || defaultCountry,
        available: Boolean(selectedMovie.available),
        source: selectedMovie.source || 'tmdb-watchmode',
      });

      resetForm();
      onClose?.();
    } catch (err) {
      console.error(err);
      setError('Erro ao adicionar filme. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const renderPriceInfo = () => {
    if (!selectedMovie?.priceInfo?.label) return null;

    return (
      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">
        {selectedMovie.priceInfo.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="roulette-overlay fixed inset-0 z-[50] flex items-start justify-center overflow-y-auto bg-black/75 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-film-title"
      onClick={onClose}
    >
      <div
        className="roulette-card relative z-[60] flex w-full max-w-3xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h2 id="add-film-title" className="text-xl font-bold text-gray-100">
              Buscar filme no TMDB
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Selecione um resultado e o app completa os dados com Watchmode.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="interactive-button text-3xl leading-none text-gray-400 hover:text-gray-200"
            aria-label="Fechar cadastro de filme"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid flex-1 min-h-0 gap-5 overflow-y-auto p-5 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-200">
                Buscar filme
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Ex.: Oppenheimer, Duna, Interestelar..."
                disabled={saving || selectionLoading}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500">
                Digite pelo menos 2 letras para ver sugestões.
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-200">Sugestões</p>
                <span className="text-xs text-gray-500">
                  {searchLoading ? 'Buscando...' : `${searchResults.length} resultado(s)`}
                </span>
              </div>

              {searchError && (
                <div className="mb-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                  {searchError}
                </div>
              )}

              <div className="space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((movie) => (
                    <button
                      key={movie.tmdbId}
                      type="button"
                      onClick={() => handlePickMovie(movie)}
                      disabled={selectionLoading}
                      className="flex w-full items-start gap-3 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-left transition-colors hover:border-gray-600 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <img
                        src={movie.posterUrl || movie.imagem || 'https://via.placeholder.com/80x120?text=Sem+Imagem'}
                        alt={movie.nome}
                        className="h-20 w-14 rounded object-cover bg-gray-800"
                        onError={(event) => {
                          event.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120"><rect fill="%231f2937" width="80" height="120"/><text x="50%" y="50%" font-size="10" fill="%234b5563" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Sem imagem</text></svg>';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-sm font-semibold text-gray-100">
                            {movie.nome}
                          </h3>
                          <span className="shrink-0 text-[11px] text-gray-500">
                            TMDB {movie.tmdbId}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'Sem data'}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                          {movie.overview || 'Sem sinopse disponível.'}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-800 px-3 py-4 text-center text-xs text-gray-500">
                    {searchLoading
                      ? 'Buscando filmes no TMDB...'
                      : 'Nenhuma sugestão ainda. Use a busca acima.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-200">Prévia</p>
                {selectionLoading && (
                  <span className="text-xs text-cyan-200">Carregando dados...</span>
                )}
              </div>

              {selectedMovie ? (
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
                    <img
                      src={selectedMovie.posterUrl || selectedMovie.imagem || 'https://via.placeholder.com/300x450?text=Sem+Imagem'}
                      alt={selectedMovie.nome}
                      className="aspect-[2/3] w-full object-cover bg-gray-800"
                      onError={(event) => {
                        event.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="%231f2937" width="300" height="450"/><text x="50%" y="50%" font-size="16" fill="%234b5563" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Sem Imagem</text></svg>';
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-200">
                      TMDB {selectedMovie.tmdbId}
                    </span>
                    <span className="rounded-full border border-gray-700 bg-gray-800 px-2 py-1 text-[11px] font-semibold text-gray-200">
                      {selectedMovie.country || defaultCountry}
                    </span>
                    {selectedMovie.available ? (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                        Disponível no Watchmode
                      </span>
                    ) : (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-100">
                        Sem disponibilidade encontrada
                      </span>
                    )}
                    {renderPriceInfo()}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-300">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleFieldChange}
                        disabled={saving || selectionLoading}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-300">
                        URL da imagem
                      </label>
                      <input
                        type="url"
                        name="imagem"
                        value={formData.imagem}
                        onChange={handleFieldChange}
                        disabled={saving || selectionLoading}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-300">
                        Sinopse
                      </label>
                      <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleFieldChange}
                        rows="4"
                        disabled={saving || selectionLoading}
                        className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-300">
                        Data de lançamento
                      </label>
                      <input
                        type="date"
                        name="lancamento"
                        value={formData.lancamento}
                        onChange={handleFieldChange}
                        disabled={saving || selectionLoading}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-300">
                        Seu nome
                      </label>
                      <input
                        type="text"
                        name="adicionadoPor"
                        value={formData.adicionadoPor}
                        onChange={handleFieldChange}
                        placeholder="Anônimo"
                        disabled={saving || selectionLoading}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[520px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-800 px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-gray-200">
                    Nenhum filme selecionado ainda
                  </p>
                  <p className="mt-2 max-w-sm text-xs text-gray-500">
                    Pesquise acima, escolha um resultado e confirme os dados antes de salvar.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={saving || selectionLoading}
                className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors duration-150 hover:bg-gray-700 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || selectionLoading || !selectedMovie}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar filme'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
