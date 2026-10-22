import { NextResponse } from "next/server";
import { pokeApiFetch } from "@/lib/pokeapi";
import { cachedJsonResponse } from "@/lib/http-cache";
import type { PokemonSpecies } from "@/types/pokemon";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const species = await pokeApiFetch<PokemonSpecies>(`/pokemon-species/${id}`);
    return cachedJsonResponse(request, species, 3600);
  } catch {
    return NextResponse.json({ error: "Pokemon species not found" }, { status: 404 });
  }
}
