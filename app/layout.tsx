import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Raleway, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { Background } from "@/components/background";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const raleway = Raleway({
	variable: "--font-raleway",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "700"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pokedex.example.com";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Pokedex | V2.0",
		template: "%s | Pokedex V2.0",
	},
	description: "Search, compare, and explore Pokemon stats, types, evolutions, and moves in a modern Next.js Pokedex.",
	keywords: ["Pokemon", "Pokedex", "Pokemon stats", "Pokemon types", "Pokemon evolution"],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		siteName: "Pokedex V2.0",
		title: "Pokedex | V2.0",
		description: "Search, compare, and explore Pokemon stats, types, evolutions, and moves in a modern Next.js Pokedex.",
		images: [{ url: "/pokeball.png", width: 512, height: 512, alt: "Pokedex" }],
	},
	twitter: {
		card: "summary",
		title: "Pokedex | V2.0",
		description: "Search, compare, and explore Pokemon stats, types, evolutions, and moves in a modern Next.js Pokedex.",
		images: ["/pokeball.png"],
	},
	robots: {
		index: true,
		follow: true,
	},
	icons: {
		icon: "/pokeball.png",
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			suppressHydrationWarning
			lang="en"
			className={`${raleway.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full">
				<div className="app-shell">
					<div className="dot-grid" aria-hidden="true" />
					<Background />
					<div className="app-frame">
						<Navbar />
						<div className="app-content">
							<QueryProvider>{children}</QueryProvider>
						</div>
						<Footer />
					</div>
				</div>
				<Toaster position="top-right" theme="dark" />
			</body>
		</html>
	);
}
