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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rotomdex-mu.vercel.app";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Rotomdex",
		template: "%s | Rotomdex",
	},
	description: "Search, compare, and explore Pokemon stats, types, evolutions, and moves with Rotomdex.",
	keywords: ["Pokemon", "Rotomdex", "Pokemon stats", "Pokemon types", "Pokemon evolution"],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		siteName: "Rotomdex",
		title: "Rotomdex",
		description: "Search, compare, and explore Pokemon stats, types, evolutions, and moves with Rotomdex.",
		images: [{ url: "/pokeball.png", width: 512, height: 512, alt: "Rotomdex" }],
	},
	twitter: {
		card: "summary",
		title: "Rotomdex",
		description: "Search, compare, and explore Pokemon stats, types, evolutions, and moves with Rotomdex.",
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
