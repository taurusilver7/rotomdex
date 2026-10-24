import type { Metadata } from "next";
import { PokemonDetail } from "@/components/pokemon-detail";
import { pokeApiFetch } from "@/lib/pokeapi";
import { getOfficialArtworkUrl } from "@/lib/pokemon-images";

type PokemonMetadata = {
	id: number;
	name: string;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;

	try {
		const pokemon = await pokeApiFetch<PokemonMetadata>(`/pokemon/${id}`);
		const title = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

		return {
			title,
			description: `View ${title}'s stats, types, evolution chain, locations, and moves.`,
			openGraph: {
				title,
				description: `View ${title}'s stats, types, evolution chain, locations, and moves.`,
				images: [{ url: getOfficialArtworkUrl(id), alt: title }],
			},
		};
	} catch {
		return {
			title: `Pokemon #${id}`,
		};
	}
}

export default async function PokemonPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <PokemonDetail id={id} />;
}