import { useMemo, useState } from "react";
import { usePokemonList } from "./use-pokemon-list";
import { getOfficialArtworkUrl } from "@/lib/pokemon-images";
import type { PokemonCardData } from "@/types/pokemon";

function createSeededRandom(seed: number) {
	let state = seed >>> 0;
	return () => {
		state += 0x6d2b79f5;
		let value = state;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffle<T>(items: T[], seed: number) {
	const result = [...items];
	const random = createSeededRandom(seed);
	for (let index = result.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(random() * (index + 1));
		[result[index], result[swapIndex]] = [result[swapIndex], result[index]];
	}
	return result;
}

export function usePokemonSearch(searchTerm: string) {
	const listQuery = usePokemonList();
	const [shuffleSeed, setShuffleSeed] = useState(() => Math.floor(Math.random() * 2147483647));

	const results = useMemo<PokemonCardData[]>(() => {
		const items = listQuery.data?.results ?? [];
		const filtered = searchTerm.trim()
			? items.filter((pokemon) => pokemon.name.includes(searchTerm.trim().toLowerCase()))
			: items;

		const ordered = searchTerm.trim() ? filtered : shuffle(filtered, shuffleSeed);

		return ordered.slice(0, 200).map((pokemon) => {
			const id = Number(pokemon.url.split("/").filter(Boolean).pop());
			return {
				name: pokemon.name,
				id,
				image: getOfficialArtworkUrl(id),
				types: [],
			};
		});
	}, [listQuery.data, searchTerm, shuffleSeed]);

	return {
		...listQuery,
		results,
		refreshRandom: () => setShuffleSeed(Math.floor(Math.random() * 2147483647)),
	};
}