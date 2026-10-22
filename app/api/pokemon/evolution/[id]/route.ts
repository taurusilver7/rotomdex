import { NextResponse } from "next/server";
import { pokeApiFetch } from "@/lib/pokeapi";
import { cachedFetch } from "@/lib/server-cache";
import { cachedJsonResponse } from "@/lib/http-cache";
import { collectEvolution, getCurrentEvolutionLevel } from "@/lib/evolution";
import type { PokemonSpecies } from "@/types/pokemon";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const species = await pokeApiFetch<PokemonSpecies>(`/pokemon-species/${id}`);
    const evolutionData = await cachedFetch(`evolution-chain:${species.evolution_chain.url}`, async () => {
      const evolutionResponse = await fetch(species.evolution_chain.url, { next: { revalidate: 3600 } });
      if (!evolutionResponse.ok) throw new Error("Evolution chain not found");
      return (await evolutionResponse.json()) as { chain: Parameters<typeof collectEvolution>[0] };
    }, 3_600_000);

    const evolution = collectEvolution(evolutionData.chain, 1, []);
    const pokemonName = species.name;
    const evolutionLevel = getCurrentEvolutionLevel(evolution, pokemonName);

    return cachedJsonResponse(request, { id: species.id, name: species.name, evolutionLevel, evolution }, 3600);
  } catch {
    return NextResponse.json({ error: "Evolution data not found" }, { status: 404 });
  }
}
