"use client";

import { useState } from "react";
import { usePokemonSearch } from "@/features/pokemon/hooks/use-pokemon-search";
import { CardGrid } from "@/components/card-grid";
import { Loader } from "@/components/loader";

const PAGE_SIZE = 24;

export function PokemonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [countTerm, setCountTerm] = useState("");
  const { results, isLoading, isError, error } = usePokemonSearch(searchTerm);

  if (countTerm !== searchTerm) {
    setCountTerm(searchTerm);
    setVisibleCount(PAGE_SIZE);
  }

  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  if (isLoading) return <Loader label="Loading Pokemon" />;
  if (isError) return <p className="p-8 text-center text-red-300">{error?.message ?? "Failed to load Pokemon."}</p>;

  return (
    <section className="flex h-full flex-col">
      <div className="w-full px-6 pt-6 pb-4">
        <input
          type="search"
          aria-label="Search Pokemon by name"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search Pokemon..."
          className="h-14 w-full border-none bg-white/10 px-4 text-xl text-white shadow-lg outline-none placeholder:text-white/70"
        />
      </div>
      <div className="flex-1 overflow-y-auto pb-8">
        <CardGrid pokemons={visibleResults} />
        {hasMore && (
          <div className="flex justify-center pb-8">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pokemon-accent"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
