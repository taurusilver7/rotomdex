import { pokeApiFetch } from "@/lib/pokeapi";
import { cachedJsonResponse } from "@/lib/http-cache";
import type { PokemonListResponse } from "@/types/pokemon";
import { filterPokemonResources } from "@/lib/excluded-pokemon";

export async function GET(request: Request) {
	const data = await pokeApiFetch<PokemonListResponse>("/pokemon?limit=2000");
	return cachedJsonResponse(
		request,
		{ ...data, count: data.results.length, results: filterPokemonResources(data.results) },
		3600,
	);
}
