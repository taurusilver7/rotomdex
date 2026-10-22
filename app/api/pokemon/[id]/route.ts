import { NextResponse } from "next/server";
import { pokeApiFetch } from "@/lib/pokeapi";
import { cachedFetch } from "@/lib/server-cache";
import { cachedJsonResponse } from "@/lib/http-cache";
import { getOfficialArtworkUrl } from "@/lib/pokemon-images";
import { collectEvolution, getCurrentEvolutionLevel } from "@/lib/evolution";
import type { PokemonDetail, PokemonEncounter, PokemonSpecies } from "@/types/pokemon";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let pokemon: PokemonDetail;
  try {
    pokemon = await pokeApiFetch<PokemonDetail>(`/pokemon/${id}`);
  } catch {
    return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
  }

  const [speciesResult, encountersResult] = await Promise.allSettled([
    pokeApiFetch<PokemonSpecies>(`/pokemon-species/${pokemon.id}`),
    cachedFetch(`encounters:${pokemon.location_area_encounters}`, async () => {
      const response = await fetch(pokemon.location_area_encounters, { next: { revalidate: 3600 } });
      if (!response.ok) throw new Error("Encounter request failed");
      return (await response.json()) as PokemonEncounter[];
    }, 3_600_000),
  ]);

  let evolution: ReturnType<typeof collectEvolution> = [];
  let evolutionLevel = 1;

  if (speciesResult.status === "fulfilled") {
    try {
      const evolutionData = await cachedFetch(`evolution-chain:${speciesResult.value.evolution_chain.url}`, async () => {
        const evolutionResponse = await fetch(speciesResult.value.evolution_chain.url, { next: { revalidate: 3600 } });
        if (!evolutionResponse.ok) throw new Error("Evolution chain request failed");
        return (await evolutionResponse.json()) as { chain: Parameters<typeof collectEvolution>[0] };
      }, 3_600_000);

      evolution = collectEvolution(evolutionData.chain, 1, []);
      evolutionLevel = getCurrentEvolutionLevel(evolution, pokemon.name);
    } catch {
      // Keep partial data available when evolution loading fails.
    }
  }

  const encounters =
    encountersResult.status === "fulfilled"
      ? encountersResult.value.map((encounter) => encounter.location_area.name.toUpperCase().replaceAll("-", " "))
      : [];

  return cachedJsonResponse(request, {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((slot) => slot.type.name),
    image: getOfficialArtworkUrl(pokemon.id),
    stats: pokemon.stats.map((stat) => ({ name: stat.stat.name, value: stat.base_stat })),
    encounters,
    evolutionLevel,
    evolution,
    pokemonAbilities: {
      abilities: pokemon.abilities.map((slot) => slot.ability.name),
      moves: pokemon.moves.map((slot) => slot.move.name),
    },
    partial: {
      species: speciesResult.status !== "fulfilled",
      encounters: encountersResult.status !== "fulfilled",
    },
  }, 300);
}
