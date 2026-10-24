import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Pokedex V2.0",
		short_name: "Pokedex",
		description: "Search, compare, and explore Pokemon in a modern Next.js Pokedex.",
		start_url: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#f51313",
		icons: [
			{
				src: "/pokeball.png",
				sizes: "any",
				type: "image/png",
			},
		],
	};
}