import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Rotomdex",
		short_name: "Rotomdex",
		description: "Search, compare, and explore Pokemon with Rotomdex.",
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