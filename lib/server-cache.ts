const TTL_CACHE = new Map<string, { value: unknown; expiresAt: number }>();
const INFLIGHT = new Map<string, Promise<unknown>>();

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = 60_000,
): Promise<T> {
  const now = Date.now();
  const cached = TTL_CACHE.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  const existing = INFLIGHT.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = fetcher()
    .then((value) => {
      TTL_CACHE.set(key, { value, expiresAt: Date.now() + ttlMs });
      INFLIGHT.delete(key);
      return value;
    })
    .catch((error) => {
      INFLIGHT.delete(key);
      throw error;
    });

  INFLIGHT.set(key, promise);
  return promise as Promise<T>;
}

export function clearServerCache(key?: string) {
  if (key) {
    TTL_CACHE.delete(key);
    INFLIGHT.delete(key);
  } else {
    TTL_CACHE.clear();
    INFLIGHT.clear();
  }
}