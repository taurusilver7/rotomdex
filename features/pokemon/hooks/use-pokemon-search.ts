"use client";

import { useMemo } from "react";
import { usePokemonList } from "./use-pokemon-list";
import { getOfficialArtworkUrl } from "@/lib/pokemon-images";
import type { PokemonCardData } from "@/types/pokemon";

export function usePokemonSearch(searchTerm: string) {
  const listQuery = usePokemonList();

  const results = useMemo<PokemonCardData[]>(() => {
    const items = listQuery.data?.results ?? [];
    const filtered = searchTerm.trim()
      ? items.filter((pokemon) => pokemon.name.includes(searchTerm.trim().toLowerCase()))
      : items;

    return filtered.slice(0, 200).map((pokemon) => {
      const id = Number(pokemon.url.split("/").filter(Boolean).pop());
      return {
        name: pokemon.name,
        id,
        image: getOfficialArtworkUrl(id),
        types: [],
      };
    });
  }, [listQuery.data, searchTerm]);

  return { ...listQuery, results };
}
