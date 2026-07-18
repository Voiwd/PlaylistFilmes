const WATCHMODE_API_BASE_URL = 'https://api.watchmode.com/v1';

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Metodo nao permitido.' });
  }

  const { action, tmdbId, title, titleId, country = 'BR' } = request.query;
  const apiKey = process.env.WATCHMODE_API_KEY?.trim();

  if (!apiKey) {
    return sendJson(response, 500, { error: 'WATCHMODE_API_KEY nao configurada na Vercel.' });
  }

  const url = new URL(WATCHMODE_API_BASE_URL);
  url.searchParams.set('apiKey', apiKey);

  if (action === 'search-tmdb' && typeof tmdbId === 'string' && /^\d+$/.test(tmdbId)) {
    url.pathname += '/search/';
    url.searchParams.set('search_field', 'tmdb_movie_id');
    url.searchParams.set('search_value', tmdbId);
    url.searchParams.set('types', 'movie');
  } else if (action === 'search-title' && typeof title === 'string' && title.trim()) {
    url.pathname += '/search/';
    url.searchParams.set('search_field', 'name');
    url.searchParams.set('search_value', title.trim());
    url.searchParams.set('types', 'movie');
  } else if (action === 'details' && typeof titleId === 'string' && /^\d+$/.test(titleId)) {
    url.pathname += `/title/${titleId}/details`;
  } else if (action === 'sources' && typeof titleId === 'string' && /^\d+$/.test(titleId)) {
    url.pathname += `/title/${titleId}/sources`;
    url.searchParams.set('regions', String(country).toUpperCase());
  } else {
    return sendJson(response, 400, { error: 'Parametros invalidos.' });
  }

  try {
    const watchmodeResponse = await fetch(url, { headers: { accept: 'application/json' } });
    const body = await watchmodeResponse.text();

    if (!watchmodeResponse.ok) {
      return sendJson(response, watchmodeResponse.status, { error: 'Watchmode nao respondeu com sucesso.' });
    }

    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    response.setHeader('Content-Type', 'application/json');
    return response.status(200).send(body);
  } catch (error) {
    console.error('Watchmode proxy error:', error.message);
    return sendJson(response, 500, { error: 'Nao foi possivel consultar o Watchmode.' });
  }
}
