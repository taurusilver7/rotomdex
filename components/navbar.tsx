"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCompareStore } from "@/stores/compare-store";


const navRoutes = [
  { name: "Search", route: "/search" },
  { name: "Pokemon", route: "/pokemon/1" },
  { name: "Compare", route: "/compare", badge: true },
  { name: "Play", route: "/play" },
];

export function Navbar() {
  const pathname = usePathname();
  const compareCount = useCompareStore((state) => state.compareQueue.length);

  const activeIndex = navRoutes.findIndex(({ route }) => {
    const base = `/${route.split("/")[1] ?? ""}`;
    return pathname === route || pathname.startsWith(base);
  });

  return (
    <nav className="grid h-full grid-cols-[3rem_auto_3rem] border-b border-white/10 md:grid-cols-[5rem_auto_5rem]">
      <div className="flex items-center justify-center">
        <Link href="/search" className="flex items-center gap-2 text-white">
          <Image src="/pokeball.png" alt="Pokedex" width={32} height={32} className="h-8 w-8" />
        </Link>
      </div>

      <div className="relative border-x border-white/10 px-4 md:px-20 lg:px-40">
        <ul className="relative grid h-full grid-cols-4 items-center list-none">
          <div
            className="underline pointer-events-none absolute bottom-0 left-0 z-0 h-[2.5px] w-1/4 bg-pokemon-accent transition-transform duration-500"
            style={{ transform: `translate3d(${(activeIndex >= 0 ? activeIndex : 0) * 100}%, 0, 0)` }}
          />
          {navRoutes.map((route) => {
            const active = pathname.startsWith(route.route.split("/")[1] ? `/${route.route.split("/")[1]}` : route.route);
            return (
              <li key={route.name} className="relative flex h-full items-center justify-center">
                <Link
                  href={route.route}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-xs font-medium uppercase tracking-widest text-white transition focus-visible:outline focus-visible:outline-pokemon-accent ${
                    active ? "text-pokemon-accent" : "hover:text-white/80"
                  }`}
                >
                  {route.name}
                  {route.badge && compareCount > 0 && (
                    <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      {compareCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center justify-center">
        <Image src="/pokeball.png" alt="Pokedex" width={32} height={32} className="h-8 w-8 opacity-60" />
      </div>
    </nav>
  );
}
