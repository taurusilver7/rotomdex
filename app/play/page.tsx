import type { Metadata } from "next";
import { PlayGame } from "@/components/play-game";

export const metadata: Metadata = {
	title: "Play",
	description: "Guess the Pokemon from its silhouette and build your score.",
};

export default function PlayPage() {
	return <PlayGame />;
}