"use client";

import Link from "next/link";
import Image from "next/image";
import { useQueries } from "@tanstack/react-query";
import { useCompareStore } from "@/stores/compare-store";
import { getTypeIconUrl } from "@/lib/type-icons";
import { pokemonTypes } from "@/lib/pokemon-type-data";
import type { PokemonCardData } from "@/types/pokemon";

type BattleStat = "strength" | "weakness" | "resistance" | "vulnerable";

function createStatsArray(types: string[], statType: BattleStat) {
  const statSet = new Set<string>();
  const stats: { name: string; icon: string }[] = [];

  for (const type of types) {
    const entry = pokemonTypes[type as keyof typeof pokemonTypes];
    if (!entry) continue;
    for (const stat of entry[statType]) {
      if (!statSet.has(stat)) {
        statSet.add(stat);
        stats.push({ name: stat, icon: getTypeIconUrl(stat) });
      }
    }
  }

  return stats;
}

function CompareSlot({
  pokemon,
  detail,
}: {
  pokemon?: PokemonCardData;
  detail?: { image?: string; types?: string[] };
}) {
  const removePokemon = useCompareStore((state) => state.removePokemon);

  if (!pokemon) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <Link
          href="/search"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-pokemon-accent text-5xl text-white transition hover:scale-105"
          aria-label="Add Pokemon to compare"
        >
          +
        </Link>
        <h3 className="text-center text-sm font-bold uppercase tracking-widest text-white/80">
          Add Pokemon to compare
        </h3>
      </div>
    );
  }

  const types = detail?.types ?? pokemon.types ?? [];
  const image = detail?.image ?? pokemon.image;

  const typeIcons = types.map((type) => ({
    type,
    icon: getTypeIconUrl(type),
  }));

  const statGroups: { title: string; stats: { name: string; icon: string }[] }[] = [
    { title: "Type", stats: typeIcons.map(({ type, icon }) => ({ name: type, icon })) },
    { title: "Strength", stats: createStatsArray(types, "strength") },
    { title: "Weakness", stats: createStatsArray(types, "weakness") },
    { title: "Resistance", stats: createStatsArray(types, "resistance") },
    { title: "Vulnerable", stats: createStatsArray(types, "vulnerable") },
  ];

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase text-white">{pokemon.name}</h2>
        <button
          type="button"
          onClick={() => removePokemon(pokemon.id)}
          className="text-xs uppercase text-red-300 transition hover:text-red-200"
        >
          Remove
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center gap-6 py-6">
        <Image
          src={image}
          alt={pokemon.name}
          width={220}
          height={220}
          className="h-56 w-56 object-contain drop-shadow-2xl"
        />

        <div className="w-full space-y-4">
          {statGroups.map((group) => (
            <div key={group.title} className="grid grid-cols-[25%_75%] items-center gap-4">
              <h4 className="text-right text-xs font-bold uppercase tracking-widest text-white/80">
                {group.title}
              </h4>
              <div className="flex flex-wrap gap-3">
                {group.stats.length > 0 ? (
                  group.stats.map((stat, index) => (
                    <div key={`${group.title}-${stat.name}-${index}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <img src={stat.icon} alt={stat.name} className="h-7 w-7 object-contain" loading="lazy" />
                    </div>
                  ))
                ) : (
                  <span className="text-xs uppercase text-white/40">None</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/pokemon/${pokemon.id}`}
          className="rounded-full border border-white/20 px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pokemon-accent"
        >
          View
        </Link>
        <button
          type="button"
          onClick={() => removePokemon(pokemon.id)}
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red-500/80"
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export function CompareView() {
  const compareQueue = useCompareStore((state) => state.compareQueue);
  const clearCompare = useCompareStore((state) => state.clearCompare);

  const detailQueries = useQueries({
    queries: compareQueue.map((pokemon) => ({
      queryKey: ["pokemon", "detail", String(pokemon.id)],
      queryFn: async () => {
        const response = await fetch(`/api/pokemon/${pokemon.id}`);
        if (!response.ok) throw new Error("Failed to load Pokemon details");
        return response.json() as Promise<{ image?: string; types?: string[] }>;
      },
      staleTime: 5 * 60_000,
    })),
  });

  const slots = [compareQueue[0], compareQueue[1]];

  if (compareQueue.length === 0) {
    return (
      <section className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-white">
        <h1 className="text-2xl font-bold uppercase">Compare</h1>
        <p className="text-white/70">Add Pokemon from search or detail pages to compare up to two.</p>
        <Link
          href="/search"
          className="rounded-full border border-pokemon-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pokemon-accent"
        >
          Go to search
        </Link>
      </section>
    );
  }

  return (
    <section className="grid h-full gap-6 p-6 md:grid-cols-2">
      {slots.map((pokemon, index) => (
        <CompareSlot
          key={pokemon?.id ?? `empty-${index}`}
          pokemon={pokemon}
          detail={detailQueries[index]?.data}
        />
      ))}
      <div className="md:col-span-2">
        <button
          type="button"
          onClick={clearCompare}
          className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase text-white transition hover:bg-white/10"
        >
          Clear compare
        </button>
      </div>
    </section>
  );
}
