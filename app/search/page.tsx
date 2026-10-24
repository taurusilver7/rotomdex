import type { Metadata } from "next";
import { PokemonSearch } from "@/components/pokemon-search";

export const metadata: Metadata = {
	title: "Search",
	description: "Search and browse Pokemon by name.",
};

export default function SearchPage() {
	return <PokemonSearch />;
}