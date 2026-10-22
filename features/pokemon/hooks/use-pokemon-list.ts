"use client";

import { useQuery } from "@tanstack/react-query";
import type { PokemonListResponse } from "@/types/pokemon";

export function usePokemonList() {
  return useQuery({
    queryKey: ["pokemon", "list"],
    queryFn: async () => {
      const response = await fetch("/api/pokemon/list");
      if (!response.ok) throw new Error("Failed to load Pokemon list");
      return (await response.json()) as PokemonListResponse;
    },
  });
}
