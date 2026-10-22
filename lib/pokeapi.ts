import { cachedFetch } from "@/lib/server-cache";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export function pokeApiUrl(path: string) {
  return `${POKEAPI_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function pokeApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return cachedFetch(`pokeapi:${path}`, async () => {
    const response = await fetch(pokeApiUrl(path), {
      ...init,
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`PokeAPI request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }, 3_600_000);
}
