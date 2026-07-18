const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

function addQueryParam(url, key, value) {
  if (value !== undefined && value !== null && value !== '') {
    url.searchParams.set(key, String(value));
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Metodo nao permitido.' });
  }

  const { action, query, movieId, language = 'pt-BR', region = 'BR' } = request.query;
  let path;

  if (action === 'search' && typeof query === 'string' && query.trim()) {
    path = '/search/movie';
  } else if (action === 'details' && typeof movieId === 'string' && /^\d+$/.test(movieId)) {
    path = `/movie/${movieId}`;
  } else {
    return sendJson(response, 400, { error: 'Parametros invalidos.' });
  }

  try {
    const url = new URL(`${TMDB_API_BASE_URL}${path}`);
    const apiKey = process.env.TMDB_API_KEY?.trim();
    const accessToken = process.env.TMDB_ACCESS_TOKEN?.trim();

    if (!apiKey && !accessToken) {
      throw new Error('Configure TMDB_API_KEY ou TMDB_ACCESS_TOKEN na Vercel.');
    }

    if (apiKey) url.searchParams.set('api_key', apiKey);
    addQueryParam(url, 'language', language);
    addQueryParam(url, 'region', region);

    if (action === 'search') {
      addQueryParam(url, 'query', query.trim());
      url.searchParams.set('include_adult', 'false');
      url.searchParams.set('page', '1');
    }

    const headers = { accept: 'application/json' };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const tmdbResponse = await fetch(url, { headers });
    const body = await tmdbResponse.text();

    if (!tmdbResponse.ok) {
      return sendJson(response, tmdbResponse.status, { error: 'TMDB nao respondeu com sucesso.' });
    }

    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    response.setHeader('Content-Type', 'application/json');
    return response.status(200).send(body);
  } catch (error) {
    console.error('TMDB proxy error:', error.message);
    return sendJson(response, 500, { error: 'Nao foi possivel consultar o TMDB.' });
  }
}
