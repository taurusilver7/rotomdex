import type { Metadata } from "next";
import { CompareView } from "@/components/compare-view";

export const metadata: Metadata = {
	title: "Compare",
	description: "Compare two Pokemon by type, strengths, weaknesses, and base stats.",
};

export default function ComparePage() {
	return <CompareView />;
}