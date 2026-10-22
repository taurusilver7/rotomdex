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
    <footer className="grid h-full grid-cols-1 border-t border-white/10 md:grid-cols-[5rem_auto_5rem]" role="contentinfo">
      <div className="hidden items-center justify-center md:flex" />
      <div className="border-x border-white/10">
        {pathname.startsWith("/pokemon") && (
          <ul className="grid h-full grid-cols-4 list-none" role="tablist" aria-label="Pokemon detail tabs">
            {routes.map((route) => (
              <li key={route.name} className="h-full">
                <button
                  type="button"
                  role="tab"
                  aria-selected={currentTab === route.name}
                  onClick={() => setCurrentTab(route.name)}
                  className={`flex h-full w-full cursor-pointer items-center justify-center text-xs font-medium uppercase tracking-widest transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-pokemon-accent ${
                    currentTab === route.name
                      ? "bg-pokemon-accent text-white"
                      : "text-white/80 hover:bg-pokemon-accent/70 hover:text-white"
                  }`}
                >
                  {route.value}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden items-center justify-center md:flex" />
    </footer>
  );
}
