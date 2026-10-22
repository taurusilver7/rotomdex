"use client";

import { useQuery } from "@tanstack/react-query";
import type { CurrentPokemon } from "@/types/pokemon";

export function usePokemonDetail(id: string) {
  return useQuery({
    queryKey: ["pokemon", "detail", id],
    queryFn: async () => {
      const response = await fetch(`/api/pokemon/${id}`);
      if (!response.ok) throw new Error("Failed to load Pokemon details");
      return (await response.json()) as CurrentPokemon & { partial?: { species: boolean; encounters: boolean } };
    },
    enabled: Boolean(id),
  });
}
