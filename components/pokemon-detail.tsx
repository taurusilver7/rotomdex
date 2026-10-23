"use client";

import { useEffect } from "react";
import Image from "next/image";
import { extractColors } from "extract-colors";
import { usePokemonDetail } from "@/features/pokemon/hooks/use-pokemon-detail";
import { usePokemonUiStore } from "@/stores/pokemon-ui-store";
import { useThemeStore } from "@/stores/theme-store";
import { useCompareStore } from "@/stores/compare-store";
import { Loader } from "@/components/loader";
import { CardGrid } from "@/components/card-grid";
import { getOfficialArtworkUrl } from "@/lib/pokemon-images";
import { pokemonTypes } from "@/lib/pokemon-type-data";
import type { CurrentPokemon } from "@/types/pokemon";

export function PokemonDetail({ id }: { id: string }) {
  const { data, isLoading, isError, error } = usePokemonDetail(id);
  const currentTab = usePokemonUiStore((state) => state.currentTab);
  const setCurrentTab = usePokemonUiStore((state) => state.setCurrentTab);
  const setAccentColor = useThemeStore((state) => state.setAccentColor);
  const addPokemon = useCompareStore((state) => state.addPokemon);

  useEffect(() => {
    setCurrentTab("description");
  }, [id, setCurrentTab]);

  useEffect(() => {
    if (!data?.image) return;

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = `/api/pokemon/image-proxy?url=${encodeURIComponent(getOfficialArtworkUrl(data.id))}`;

    const options = {
      pixels: 10000,
      distance: 1,
      splitPower: 10,
      colorValidator: (red: number, green: number, blue: number, alpha = 255) => alpha > 250,
      saturationDistance: 0.2,
      lightnessDistance: 0.2,
      hueDistance: 0.083333333,
    };

    image.onload = () => {
      extractColors(image, options)
        .then((colors) => {
          if (colors[0]?.hex) setAccentColor(colors[0].hex);
        })
        .catch(() => {
          // Keep the default accent color if extraction fails.
        });
    };
  }, [data?.image, setAccentColor]);

  if (isLoading) return <Loader label="Loading Pokemon" />;
  if (isError || !data) {
    return <p className="p-8 text-center text-red-300">{error?.message ?? "Failed to load Pokemon."}</p>;
  }

  if (currentTab === "evolution") {
    return (
      <section className="scroll-area h-full w-full overflow-y-auto p-6">
        <EvolutionTab data={data} />
      </section>
    );
  }

  if (currentTab === "locations") {
    return (
      <section className="scroll-area h-full w-full overflow-y-auto p-6">
        <LocationsTab data={data} />
      </section>
    );
  }

  if (currentTab === "moves") {
    return (
      <section className="scroll-area h-full w-full overflow-y-auto p-6">
        <MovesTab data={data} />
      </section>
    );
  }

  return (
    <section className="scroll-area relative h-full w-full overflow-y-auto p-4 md:p-6">
      <div className="relative z-20 mb-4 w-full bg-[rgba(255,255,255,0.051)] p-4 uppercase text-white md:absolute md:mb-0 md:left-4 md:top-4 md:w-88 before:absolute before:left-0 before:top-0 before:h-[0.3rem] before:w-40 before:bg-pokemon-accent before:content-[''] after:absolute after:left-0 after:top-0 after:h-24 after:w-1 after:bg-pokemon-accent after:content-['']">
        <h1 className="mb-4 text-2xl font-bold uppercase">{data.name}</h1>
        <h3 className="text-sm uppercase">Type: {data.types.join(" - ")}</h3>
        <h3 className="text-sm uppercase">Evolution: {data.evolutionLevel}</h3>
        <button
          type="button"
          onClick={() => setCurrentTab("evolution")}
          className="absolute -bottom-8 right-4 border border-pokemon-accent bg-transparent px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pokemon-accent"
        >
          See next evolution
        </button>
      </div>

      <div className="relative z-20 mb-4 hidden w-full md:absolute md:bottom-16 md:left-4 md:block md:w-88">
        <ul className="flex flex-col gap-4">
          {data.stats.map((stat) => (
            <li key={stat.name} className="flex items-center justify-end gap-4 text-xs uppercase tracking-wider text-white">
              <span>
                {stat.name}: {stat.value}
              </span>
              <progress
                max={100}
                value={stat.value}
                className="h-[0.3rem] w-40 overflow-hidden rounded-full bg-transparent [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-pokemon-accent"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-20 mb-4 w-full bg-[rgba(255,255,255,0.051)] p-4 text-white md:absolute md:mb-0 md:bottom-10 md:right-4 md:w-104 before:absolute before:bottom-0 before:right-0 before:h-[0.3rem] before:w-40 before:bg-pokemon-accent before:content-[''] after:absolute after:bottom-0 after:right-0 after:h-24 after:w-1 after:bg-pokemon-accent after:content-['']">
        <ul className="flex flex-col gap-2 text-xs uppercase tracking-wider">
          <li className="grid grid-cols-[max-content_1fr] gap-2">
            <span className="text-right">Strong:</span>
            <span>{getBattleStats(data.types, "strength").join(", ") || "None"}</span>
          </li>
          <li className="grid grid-cols-[max-content_1fr] gap-2">
            <span className="text-right">Weak:</span>
            <span>{getBattleStats(data.types, "weakness").join(", ") || "None"}</span>
          </li>
          <li className="grid grid-cols-[max-content_1fr] gap-2">
            <span className="text-right">Resistance:</span>
            <span>{getBattleStats(data.types, "resistance").join(", ") || "None"}</span>
          </li>
          <li className="grid grid-cols-[max-content_1fr] gap-2">
            <span className="text-right">Vulnerable:</span>
            <span>{getBattleStats(data.types, "vulnerable").join(", ") || "None"}</span>
          </li>
        </ul>
        <button
          type="button"
          onClick={() =>
            addPokemon({
              name: data.name,
              id: data.id,
              image: data.image,
              types: data.types,
            })
          }
          className="absolute -bottom-8 -left-4 border border-pokemon-accent bg-transparent px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pokemon-accent"
        >
          Add Pokemon
        </button>
      </div>

      <div className="relative z-10 flex min-h-64 items-center justify-center md:h-full">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-full border-2 border-pokemon-accent md:h-96 md:w-96">
          <div className="flex h-56 w-56 items-center justify-center rounded-full border-4 border-pokemon-accent md:h-80 md:w-80">
            <Image
              src={getOfficialArtworkUrl(data.id)}
              alt={data.name}
              width={288}
              height={288}
              sizes="(max-width: 768px) 60vw, 288px"
              className="relative z-10 h-48 w-48 object-contain drop-shadow-2xl md:h-72 md:w-72"
              onError={(event) => {
                event.currentTarget.src = getOfficialArtworkUrl(data.id);
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-8 md:gap-12">
            <div className="h-72 w-1 rotate-45 bg-pokemon-accent md:h-112" />
            <div className="h-72 w-1 rotate-45 bg-pokemon-accent md:h-112" />
          </div>
        </div>
      </div>
    </section>
  );
}

function EvolutionTab({ data }: { data: CurrentPokemon }) {
  const evolutionPokemons = data.evolution.map((entry) => {
    const id = Number(entry.pokemon.url.split("/").filter(Boolean).pop());
    return {
      name: entry.pokemon.name,
      id,
      image: getOfficialArtworkUrl(id),
      types: [],
    };
  });

  return <CardGrid pokemons={evolutionPokemons} />;
}

function LocationsTab({ data }: { data: CurrentPokemon }) {
  if (data.encounters.length === 0) {
    return <p className="text-white/70">No encounter locations found.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {data.encounters.map((encounter) => (
        <li
          key={encounter}
          className="flex min-h-37 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm uppercase text-white shadow-[0_5px_15px_rgba(0,0,0,0.35)]"
        >
          {encounter}
        </li>
      ))}
    </ul>
  );
}

function MovesTab({ data }: { data: CurrentPokemon }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold uppercase text-white">Abilities</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {data.pokemonAbilities.abilities.map((ability) => (
            <li key={ability} className="flex min-h-37 items-center justify-center rounded-2xl bg-pokemon-accent p-4 text-center text-sm uppercase text-pokemon-accent-contrast shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
              {ability}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="mb-3 text-lg font-semibold uppercase text-white">Moves</h2>
        <ul className="grid max-h-96 grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {data.pokemonAbilities.moves.map((move) => (
            <li key={move} className="flex min-h-37 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm uppercase text-white shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
              {move}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getBattleStats(types: string[], statType: "strength" | "weakness" | "resistance" | "vulnerable") {
  const statSet = new Set<string>();

  for (const type of types) {
    const entry = pokemonTypes[type as keyof typeof pokemonTypes];
    if (!entry) continue;
    for (const stat of entry[statType]) {
      statSet.add(stat.charAt(0).toUpperCase() + stat.slice(1));
    }
  }

  return Array.from(statSet);
}
