"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQueries } from "@tanstack/react-query";
import { useCompareStore } from "@/stores/compare-store";
import { getTypeIconUrl } from "@/lib/type-icons";
import { isPokemonExcluded } from "@/lib/excluded-pokemon";
import { pokemonTypes } from "@/lib/pokemon-type-data";
import type { PokemonCardData } from "@/types/pokemon";

type BattleStat = "strength" | "weakness" | "resistance" | "vulnerable";
type CompareDetail = {
	image?: string;
	types?: string[];
	stats?: { name: string; value: number }[];
};

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

function formatStatName(name: string) {
	return name
		.replace(/-/g, " ")
		.replace(/\b\w/g, (character) => character.toUpperCase());
}

function CompareSlot({
	pokemon,
	detail,
	opponentDetail,
	isLoading,
	showBaseStats,
}: {
	pokemon?: PokemonCardData;
	detail?: CompareDetail;
	opponentDetail?: CompareDetail;
	isLoading?: boolean;
	showBaseStats: boolean;
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

	const stats = detail?.stats ?? [];
	const opponentStats = opponentDetail?.stats ?? [];
	const statNames = Array.from(
		new Set([...stats.map((stat) => stat.name), ...opponentStats.map((stat) => stat.name)]),
	);
	const statMap = new Map(stats.map((stat) => [stat.name, stat.value]));
	const opponentMap = new Map(opponentStats.map((stat) => [stat.name, stat.value]));
	const visibleStatNames = statNames;

	return (
		<article className="flex h-auto flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition md:h-full">
			<div className="flex items-center justify-between gap-4">
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
					className="h-48 w-48 object-contain drop-shadow-2xl sm:h-56 sm:w-56"
				/>

				<div className="w-full space-y-4">
					{statGroups.map((group) => (
						<div key={group.title} className="grid grid-cols-[28%_72%] items-center gap-4">
							<h4 className="text-right text-xs font-bold uppercase tracking-widest text-white/80">
								{group.title}
							</h4>
							<div className="flex flex-wrap gap-3">
								{group.stats.length > 0 ? (
									group.stats.map((stat, index) => (
										<div
											key={`${group.title}-${stat.name}-${index}`}
											className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
										>
											<img
												src={stat.icon}
												alt={stat.name}
												className="h-7 w-7 object-contain"
												loading="lazy"
											/>
										</div>
									))
								) : (
									<span className="text-xs uppercase text-white/40">None</span>
								)}
							</div>
						</div>
					))}

					{showBaseStats && (
						<div className="space-y-3 border-t border-white/10 pt-4">
							<h4 className="text-xs font-bold uppercase tracking-widest text-white/80">
								Base Stats
							</h4>
						{isLoading && statNames.length === 0 ? (
							<div className="space-y-2">
								{Array.from({ length: 6 }).map((_, index) => (
									<div key={index} className="h-4 rounded-full bg-white/10" />
								))}
							</div>
						) : visibleStatNames.length > 0 ? (
							visibleStatNames.map((name) => {
								const value = statMap.get(name) ?? 0;
								const opponentValue = opponentMap.get(name) ?? 0;
								const maxValue = Math.max(value, opponentValue, 1);
								const width = `${(value / maxValue) * 100}%`;
								const isWinner = value > opponentValue;

								return (
									<div key={name} className="grid grid-cols-[34%_1fr_3rem] items-center gap-3">
										<span className="text-right text-xs uppercase text-white/70">
											{formatStatName(name)}
										</span>
										<div className="h-2 overflow-hidden rounded-full bg-white/10">
											<div
												className={`h-full rounded-full transition-all ${
													isWinner ? "bg-pokemon-accent" : "bg-white/40"
												}`}
												style={{ width }}
											/>
										</div>
										<span className="text-xs font-bold text-white">{value}</span>
									</div>
								);
							})
						) : (
							<span className="text-xs uppercase text-white/40">No base stats loaded</span>
						)}
					</div>
					)}
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
	const swapCompare = useCompareStore((state) => state.swapCompare);
	const addPokemon = useCompareStore((state) => state.addPokemon);

	const detailQueries = useQueries({
		queries: compareQueue.map((pokemon) => ({
			queryKey: ["pokemon", "detail", String(pokemon.id)],
			queryFn: async () => {
				const response = await fetch(`/api/pokemon/${pokemon.id}`);
				if (!response.ok) throw new Error("Failed to load Pokemon details");
				return response.json() as Promise<CompareDetail>;
			},
			staleTime: 5 * 60_000,
		})),
	});

	const slots = [compareQueue[0], compareQueue[1]];
	const [showBaseStats, setShowBaseStats] = useState(false);
	const [copied, setCopied] = useState(false);
	const hydratedRef = useRef(false);

	useEffect(() => {
		if (hydratedRef.current) return;
		hydratedRef.current = true;

		const params = new URLSearchParams(window.location.search);
		const leftId = params.get("left");
		const rightId = params.get("right");

		const loadPokemon = async (id: string | null) => {
			if (!id) return;
			const numericId = Number(id);
			if (!Number.isFinite(numericId)) return;
			if (isPokemonExcluded(numericId)) return;
			if (compareQueue.some((pokemon) => pokemon.id === numericId)) return;

			const response = await fetch(`/api/pokemon/${numericId}`);
			if (!response.ok) return;
			const data = (await response.json()) as {
				id: number;
				name: string;
				image: string;
				types: string[];
			};
			addPokemon({
				name: data.name,
				id: data.id,
				image: data.image,
				types: data.types,
			});
		};

		// Add the right slot first because addPokemon prepends items.
		void loadPokemon(rightId);
		void loadPokemon(leftId);
	}, [addPokemon, compareQueue]);

	useEffect(() => {
		const url = new URL(window.location.href);
		const [left, right] = [compareQueue[0], compareQueue[1]];
		if (left) url.searchParams.set("left", String(left.id));
		else url.searchParams.delete("left");
		if (right) url.searchParams.set("right", String(right.id));
		else url.searchParams.delete("right");
		window.history.replaceState({}, "", url);
	}, [compareQueue]);

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			setCopied(false);
		}
	};

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
		<section className="scroll-area grid h-full gap-6 overflow-y-auto p-4 sm:p-6 md:grid-cols-2">
			{slots.map((pokemon, index) => (
				<CompareSlot
					key={pokemon?.id ?? `empty-${index}`}
					pokemon={pokemon}
					detail={detailQueries[index]?.data}
					opponentDetail={detailQueries[index === 0 ? 1 : 0]?.data}
					isLoading={detailQueries[index]?.isLoading}
					showBaseStats={showBaseStats}
				/>
			))}
			<div className="flex flex-wrap items-center justify-center gap-3 md:col-span-2">
				<button
					type="button"
					onClick={swapCompare}
					disabled={compareQueue.length < 2}
					className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Swap
				</button>
				<button
					type="button"
					onClick={() => setShowBaseStats((value) => !value)}
					className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase text-white transition hover:bg-white/10"
				>
					{showBaseStats ? "Hide base stats" : "Show all stats"}
				</button>
				<button
					type="button"
					onClick={() => void copyLink()}
					className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase text-white transition hover:bg-white/10"
				>
					{copied ? "Copied" : "Copy link"}
				</button>
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