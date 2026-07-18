import {
  getTmdbMovieDetails,
  normalizeTmdbMovie,
  searchTmdbMovies,
} from './tmdbService';
import {
  getWatchmodeTitleDetails,
  getWatchmodeTitleSources,
  searchWatchmodeTitleByName,
  searchWatchmodeTitleByTmdbId,
  summarizeWatchmodeSources,
} from './watchmodeService';

function buildCountryCode(country) {
  return (country || import.meta.env.VITE_DEFAULT_COUNTRY || 'BR').trim().toUpperCase();
}

export async function searchMoviesForForm(query, options = {}) {
  const results = await searchTmdbMovies(query, options);
  return results.map((movie) => ({
    ...movie,
    searchLabel: `${movie.nome}${movie.releaseDate ? ` (${movie.releaseDate.slice(0, 4)})` : ''}`,
  }));
}

export async function enrichMovieFromTmdb(movie, options = {}) {
  if (!movie?.tmdbId && !movie?.id) {
    throw new Error('Filme TMDB inválido.');
  }

  const country = buildCountryCode(options.country);
  const tmdbId = movie.tmdbId || movie.id;
  let tmdbMovie;

  try {
    tmdbMovie = await getTmdbMovieDetails(tmdbId, options);
  } catch (error) {
    if (!movie.raw) {
      throw error;
    }

    tmdbMovie = normalizeTmdbMovie(movie.raw);
  }

  let watchmodeMatch = await searchWatchmodeTitleByTmdbId(tmdbMovie.tmdbId, {
    signal: options.signal,
  });

  if (!watchmodeMatch) {
    watchmodeMatch = await searchWatchmodeTitleByName(tmdbMovie.nome, {
      signal: options.signal,
    });
  }

  let watchmodeDetails = null;
  let watchmodeSources = [];

  if (watchmodeMatch?.watchmodeId) {
    try {
      watchmodeDetails = await getWatchmodeTitleDetails(watchmodeMatch.watchmodeId, {
        signal: options.signal,
      });

      watchmodeSources = await getWatchmodeTitleSources(watchmodeMatch.watchmodeId, {
        signal: options.signal,
        country,
      });
    } catch (error) {
      console.warn('Watchmode enrichment falhou; salvando apenas os dados TMDB.', error);
      watchmodeDetails = null;
      watchmodeSources = [];
      watchmodeMatch = null;
    }
  }

  const watchmodeSummary = summarizeWatchmodeSources(watchmodeSources);

  return {
    ...tmdbMovie,
    country,
    watchmodeId: watchmodeMatch?.watchmodeId ?? watchmodeDetails?.watchmodeId ?? null,
    watchmodeTitle: watchmodeDetails?.title || watchmodeMatch?.title || tmdbMovie.nome,
    watchmodeUrl: watchmodeDetails?.webUrl || '',
    providers: watchmodeSummary.providers,
    available: watchmodeSummary.available,
    priceInfo: watchmodeSummary.priceInfo,
    watchmodeRaw: {
      match: watchmodeMatch?.raw || null,
      details: watchmodeDetails?.raw || null,
      sources: watchmodeSources.map((source) => source.raw),
    },
    source: 'tmdb-watchmode',
  };
}
