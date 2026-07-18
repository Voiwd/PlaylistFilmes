const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const defaultLanguage = import.meta.env.APP_TMDB_LANGUAGE?.trim() || 'pt-BR';
const defaultRegion = import.meta.env.APP_TMDB_REGION?.trim() || 'BR';

async function tmdbFetch(params, options = {}) {
  const url = new URL('/api/tmdb', window.location.origin);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    signal: options.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`TMDB request failed (${response.status}): ${body || response.statusText}`);
  }

  return response.json();
}

export function buildTmdbPosterUrl(posterPath) {
  if (!posterPath) return '';
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
}

export function normalizeTmdbMovie(movie) {
  if (!movie) return null;

  const posterUrl = buildTmdbPosterUrl(movie.poster_path);

  return {
    tmdbId: movie.id,
    nome: movie.title || movie.original_title || '',
    originalTitle: movie.original_title || '',
    imagem: posterUrl,
    posterPath: movie.poster_path || '',
    posterUrl,
    descricao: movie.overview || '',
    overview: movie.overview || '',
    lancamento: movie.release_date || '',
    releaseDate: movie.release_date || '',
    language: movie.original_language || '',
    backdropPath: movie.backdrop_path || '',
    backdropUrl: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : '',
    popularity: movie.popularity ?? null,
    voteAverage: movie.vote_average ?? null,
    voteCount: movie.vote_count ?? null,
    adult: Boolean(movie.adult),
    genreIds: movie.genre_ids || [],
    genres: movie.genres || [],
    raw: movie,
  };
}

export async function searchTmdbMovies(query, options = {}) {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) return [];

  const data = await tmdbFetch({
    action: 'search',
    query: normalizedQuery,
    language: options.language || defaultLanguage,
    region: options.region || defaultRegion,
  }, options);

  return Array.isArray(data?.results) ? data.results.map(normalizeTmdbMovie) : [];
}

export async function getTmdbMovieDetails(movieId, options = {}) {
  if (!movieId) {
    throw new Error('TMDB movieId ausente.');
  }

  const data = await tmdbFetch({
    action: 'details',
    movieId: String(movieId),
    language: options.language || defaultLanguage,
    region: options.region || defaultRegion,
  }, options);

  return normalizeTmdbMovie(data);
}
