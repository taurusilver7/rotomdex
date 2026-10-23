"use client";

import { useEffect, useState } from "react";
import { usePokemonSearch } from "@/features/pokemon/hooks/use-pokemon-search";
import { CardGrid } from "@/components/card-grid";
import { Loader } from "@/components/loader";

const PAGE_SIZE = 24;

export function PokemonSearch() {
	const [searchTerm, setSearchTerm] = useState("");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const { results, isLoading, isError, error, refreshRandom } = usePokemonSearch(searchTerm);

	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [searchTerm]);

	const visibleResults = results.slice(0, visibleCount);
	const hasMore = visibleCount < results.length;

	if (isLoading) return <Loader label="Loading Pokemon" />;
	if (isError)
		return (
			<p className="p-8 text-center text-red-300">
				{error?.message ?? "Failed to load Pokemon."}
			</p>
		);

	return (
		<section className="flex h-full w-full flex-col px-4 sm:px-6">
			<div className="flex w-full items-center gap-3 pt-6 pb-4">
				<input
					type="search"
					aria-label="Search Pokemon by name"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder="Search Pokemon..."
					className="h-14 min-w-0 flex-1 border-none rounded-xl bg-white/10 px-4 text-xl text-white shadow-lg outline-none placeholder:text-white/70"
				/>
				<button
					type="button"
					onClick={refreshRandom}
					disabled={Boolean(searchTerm.trim())}
					className="h-14 rounded-xl border border-white/20 px-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-pokemon-accent disabled:cursor-not-allowed disabled:opacity-40"
				>
					Shuffle
				</button>
			</div>
			<div className="scroll-area flex-1 overflow-y-auto pb-8">
				<CardGrid pokemons={visibleResults} />
				{hasMore && (
					<div className="flex justify-center pb-8">
						<button
							type="button"
							onClick={() =>
								setVisibleCount((count) => count + PAGE_SIZE)
							}
							className="rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-pokemon-accent"
						>
							Load more
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
