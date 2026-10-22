import { NextResponse } from "next/server";
import { pokeApiFetch } from "@/lib/pokeapi";
import { cachedJsonResponse } from "@/lib/http-cache";
import type { PokemonListResponse } from "@/types/pokemon";

export async function GET(request: Request) {
  const data = await pokeApiFetch<PokemonListResponse>("/pokemon?limit=2000");
  return cachedJsonResponse(request, data, 3600);
}
