"use client";

import { useQuery } from "@tanstack/react-query";
import type { PokemonListResponse } from "@/types/pokemon";
import { filterPokemonResources } from "@/lib/excluded-pokemon";

export function usePokemonList() {
	return useQuery({
		queryKey: ["pokemon", "list"],
		queryFn: async () => {
			const response = await fetch("/api/pokemon/list");
			if (!response.ok) throw new Error("Failed to load Pokemon list");
			const data = (await response.json()) as PokemonListResponse;
			return { ...data, results: filterPokemonResources(data.results) };
		},
	});
}
