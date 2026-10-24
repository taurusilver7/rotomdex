import type { MetadataRoute } from "next";
import { filterPokemonResources } from "@/lib/excluded-pokemon";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pokedex.example.com";
	const staticRoutes = ["", "/search", "/compare", "/play"].map((route) => ({
		url: `${siteUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: route === "" ? 1 : 0.8,
	}));

	let pokemonRoutes: MetadataRoute.Sitemap = [];
	try {
		const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000", {
			next: { revalidate: 86400 },
		});
		if (response.ok) {
			const data = (await response.json()) as { results: { url: string }[] };
			pokemonRoutes = filterPokemonResources(data.results).map((pokemon) => {
				const id = pokemon.url.split("/").filter(Boolean).pop();
				return {
					url: `${siteUrl}/pokemon/${id}`,
					lastModified: new Date(),
					changeFrequency: "monthly" as const,
					priority: 0.6,
				};
			});
		}
	} catch {
		// Keep static routes available if PokeAPI is unavailable during build.
	}

	return [...staticRoutes, ...pokemonRoutes];
}