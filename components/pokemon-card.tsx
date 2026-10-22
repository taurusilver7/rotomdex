"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/stores/compare-store";
import { getTypeIconUrl } from "@/lib/type-icons";
import type { PokemonCardData } from "@/types/pokemon";

export function PokemonCard({ pokemon, priority = false }: { pokemon: PokemonCardData; priority?: boolean }) {
  const addPokemon = useCompareStore((state) => state.addPokemon);

  return (
    <article className="relative flex w-62 flex-col items-center rounded-2xl bg-white/10 p-4 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20 hover:shadow-2xl">
      <Link href={`/pokemon/${pokemon.id}`} className="block">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={192}
          height={192}
          sizes="(max-width: 768px) 50vw, 250px"
          priority={priority}
          className="h-48 w-48 cursor-pointer object-contain drop-shadow-[20px_10px_10px_#14121281]"
          loading={priority ? "eager" : "lazy"}
        />
        <h2 className="mt-4 cursor-pointer text-center text-lg font-medium uppercase tracking-wide text-white">
          {pokemon.name}
        </h2>
      </Link>

      {pokemon.types.length > 0 && (
        <div className="mt-4 grid w-full grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-4">
          {pokemon.types.map((type) => (
            <div key={type} className="flex flex-col items-center gap-1">
              <img
                src={getTypeIconUrl(type)}
                alt={type}
                className="h-8 w-8 object-contain"
              />
              <span className="text-[10px] uppercase text-white/80">{type}</span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => addPokemon(pokemon)}
        className="absolute right-3 top-3 text-3xl text-blue-400 transition hover:scale-110"
        aria-label="Add to compare"
      >
        +
      </button>
    </article>
  );
}
