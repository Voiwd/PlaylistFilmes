const defaultCountry = import.meta.env.APP_DEFAULT_COUNTRY?.trim() || 'BR';

async function watchmodeFetch(params, options = {}) {
  const url = new URL('/api/watchmode', window.location.origin);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    signal: options.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `Watchmode request failed (${response.status}): ${body || response.statusText}`
    );
  }

  return response.json();
}

function extractResults(payload) {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.title_results)) return payload.title_results;
  if (Array.isArray(payload?.titles)) return payload.titles;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

export function normalizeWatchmodeSearchResult(item) {
  if (!item) return null;

  return {
    watchmodeId: item.id ?? item.title_id ?? item.watchmode_id ?? null,
    title: item.title || item.name || item.original_title || '',
    year: item.year ?? item.release_year ?? null,
    tmdbId: item.tmdb_id ?? null,
    imdbId: item.imdb_id ?? null,
    type: item.type || item.title_type || 'movie',
    raw: item,
  };
}

export function normalizeWatchmodeSource(source) {
  if (!source) return null;

  const priceValue = source.price ?? source.rent_price ?? source.buy_price ?? null;
  const currency = source.currency || source.price_currency || source.currency_code || '';

  return {
    sourceId: source.source_id ?? source.id ?? null,
    name: source.name || source.source_name || '',
    type: source.type || source.format || '',
    region: source.region || '',
    webUrl: source.web_url || source.webUrl || '',
    iosUrl: source.ios_url || source.iosUrl || '',
    androidUrl: source.android_url || source.androidUrl || '',
    price: priceValue,
    currency,
    label: formatWatchmodePrice(priceValue, currency),
    raw: source,
  };
}

export function formatWatchmodePrice(price, currency) {
  if (price === undefined || price === null || price === '') return '';

  const numericValue = Number(price);
  if (Number.isNaN(numericValue)) {
    return currency ? `${price} ${currency}` : String(price);
  }

  if (currency) {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
      }).format(numericValue);
    } catch {
      return `${currency} ${numericValue.toFixed(2)}`;
    }
  }

  return numericValue.toFixed(2);
}

export function normalizeWatchmodeDetails(details) {
  if (!details) return null;

  return {
    watchmodeId: details.id ?? details.title_id ?? null,
    title: details.title || details.name || '',
    year: details.year ?? null,
    type: details.type || '',
    webUrl: details.web_url || details.url || '',
    tmdbId: details.tmdb_id ?? null,
    imdbId: details.imdb_id ?? null,
    raw: details,
  };
}

export async function searchWatchmodeTitleByTmdbId(tmdbId, options = {}) {
  if (!tmdbId) return null;

  try {
    const data = await watchmodeFetch({ action: 'search-tmdb', tmdbId: String(tmdbId) }, options);

    const results = extractResults(data).map(normalizeWatchmodeSearchResult).filter(Boolean);
    return results[0] || null;
  } catch (error) {
    console.warn('Watchmode TMDB lookup falhou, tentando por nome.', error);
    return null;
  }
}

export async function searchWatchmodeTitleByName(title, options = {}) {
  const normalizedTitle = title?.trim();
  if (!normalizedTitle) return null;

  const data = await watchmodeFetch({ action: 'search-title', title: normalizedTitle }, options);

  const results = extractResults(data).map(normalizeWatchmodeSearchResult).filter(Boolean);
  return results[0] || null;
}

export async function getWatchmodeTitleDetails(titleId, options = {}) {
  if (!titleId) return null;

  const data = await watchmodeFetch({ action: 'details', titleId: String(titleId) }, options);
  return normalizeWatchmodeDetails(data);
}

export async function getWatchmodeTitleSources(titleId, options = {}) {
  if (!titleId) return [];

  const data = await watchmodeFetch({
    action: 'sources',
    titleId: String(titleId),
    country: options.country || defaultCountry,
  }, options);

  return extractResults(data).map(normalizeWatchmodeSource).filter(Boolean);
}

export function summarizeWatchmodeSources(sources = []) {
  const providers = sources.filter(Boolean);
  const withPrice = providers.filter((source) => source.price !== null && source.price !== undefined);
  const bestPriced = withPrice[0] || null;

  return {
    providers,
    available: providers.length > 0,
    priceInfo: bestPriced
      ? {
          provider: bestPriced.name,
          type: bestPriced.type,
          price: bestPriced.price,
          currency: bestPriced.currency,
          label: bestPriced.label,
        }
      : null,
  };
}
