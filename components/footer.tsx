"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePokemonUiStore } from "@/stores/pokemon-ui-store";

const routes = [
	{ name: "description", value: "Description" },
	{ name: "evolution", value: "Evolution" },
	{ name: "locations", value: "Catching" },
	{ name: "moves", value: "Capable Moves" },
] as const;

export function Footer() {
	const pathname = usePathname();
	const currentTab = usePokemonUiStore((state) => state.currentTab);
	const setCurrentTab = usePokemonUiStore((state) => state.setCurrentTab);

	useEffect(() => {
		if (!pathname.startsWith("/pokemon")) {
			setCurrentTab("description");
		}
	}, [pathname, setCurrentTab]);

	return (
		<footer
			className="grid h-full grid-cols-[3rem_auto_3rem] border-t border-white/10 md:grid-cols-[5rem_auto_5rem]"
			role="contentinfo"
		>
			<div className="flex items-center justify-center" aria-hidden="true">
				{/* <div className="h-8 w-8 border border-white/10" /> */}
			</div>

			<div className="relative border-x border-white/10 px-4 md:px-20 lg:px-40">
				{pathname.startsWith("/pokemon") ? (
					<ul
						className="grid h-full grid-cols-4 list-none"
						role="tablist"
						aria-label="Pokemon detail tabs"
					>
						{routes.map((route) => (
							<li key={route.name} className="h-full">
								<button
									type="button"
									role="tab"
									aria-selected={currentTab === route.name}
									onClick={() => setCurrentTab(route.name)}
									className={`flex h-full w-full cursor-pointer items-center justify-center px-1 text-[10px] font-medium uppercase tracking-widest transition focus-visible:outline focus-visible:outline-pokemon-accent sm:text-xs ${
										currentTab === route.name
											? "bg-pokemon-accent text-pokemon-accent-contrast"
											: "text-white/80 hover:bg-pokemon-accent/70 hover:text-pokemon-accent-contrast"
									}`}
								>
									{route.value}
								</button>
							</li>
						))}
					</ul>
				) : (
					<div className="h-full" />
				)}
			</div>

			<div className="flex items-center justify-center" aria-hidden="true">
				{/* <div className="h-8 w-8 border border-white/10 opacity-60" /> */}
			</div>
		</footer>
	);
}
