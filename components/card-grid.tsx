"use client";

import { useQueries } from "@tanstack/react-query";
import { PokemonCard } from "./pokemon-card";
import type { PokemonCardData } from "@/types/pokemon";

export function CardGrid({ pokemons }: { pokemons: PokemonCardData[] }) {
  const detailQueries = useQueries({
    queries: pokemons.map((pokemon) => ({
      queryKey: ["pokemon", "detail", String(pokemon.id)],
      queryFn: async () => {
        const response = await fetch(`/api/pokemon/${pokemon.id}`);
        if (!response.ok) throw new Error("Failed to load Pokemon details");
        return response.json() as Promise<{ types?: string[] }>;
      },
      staleTime: 5 * 60_000,
    })),
  });

  const enriched = pokemons.map((pokemon, index) => ({
    ...pokemon,
    types: detailQueries[index]?.data?.types ?? pokemon.types,
  }));

  if (pokemons.length === 0) {
    return <p className="p-8 text-center uppercase text-white/70">No Pokemon found.</p>;
  }

  return (
    <div className="px-6 pb-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
        {enriched.map((pokemon, index) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} priority={index < 4} />
        ))}
      </div>
    </div>
  );
}
