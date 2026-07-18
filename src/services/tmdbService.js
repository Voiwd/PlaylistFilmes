const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY?.trim();
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();
const defaultLanguage = import.meta.env.VITE_TMDB_LANGUAGE?.trim() || 'pt-BR';
const defaultRegion = import.meta.env.VITE_TMDB_REGION?.trim() || 'BR';

function buildTmdbHeaders() {
  const headers = {
    accept: 'application/json',
  };

  if (tmdbAccessToken) {
    headers.Authorization = `Bearer ${tmdbAccessToken}`;
  }

  return headers;
}

function buildTmdbUrl(path, params = {}) {
  const url = new URL(`${TMDB_API_BASE_URL}${path}`);

  if (tmdbApiKey) {
    url.searchParams.set('api_key', tmdbApiKey);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

async function tmdbFetch(path, params = {}, options = {}) {
  if (!tmdbApiKey && !tmdbAccessToken) {
    throw new Error(
      'TMDB não configurado. Defina VITE_TMDB_API_KEY ou VITE_TMDB_ACCESS_TOKEN.'
    );
  }

  const response = await fetch(buildTmdbUrl(path, params), {
    signal: options.signal,
    headers: buildTmdbHeaders(),
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

  const data = await tmdbFetch(
    '/search/movie',
    {
      query: normalizedQuery,
      include_adult: 'false',
      language: options.language || defaultLanguage,
      region: options.region || defaultRegion,
      page: '1',
    },
    options
  );

  return Array.isArray(data?.results) ? data.results.map(normalizeTmdbMovie) : [];
}

export async function getTmdbMovieDetails(movieId, options = {}) {
  if (!movieId) {
    throw new Error('TMDB movieId ausente.');
  }

  const data = await tmdbFetch(
    `/movie/${movieId}`,
    {
      language: options.language || defaultLanguage,
      region: options.region || defaultRegion,
    },
    options
  );

  return normalizeTmdbMovie(data);
}
