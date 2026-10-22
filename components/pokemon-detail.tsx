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
import { getOfficialArtworkUrl, getShinyArtworkUrl } from "@/lib/pokemon-images";
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
    image.src = `/api/pokemon/image-proxy?url=${encodeURIComponent(getShinyArtworkUrl(data.id))}`;

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
      <section className="h-full w-full overflow-y-auto p-6">
        <EvolutionTab data={data} />
      </section>
    );
  }

  if (currentTab === "locations") {
    return (
      <section className="h-full w-full overflow-y-auto p-6">
        <LocationsTab data={data} />
      </section>
    );
  }

  if (currentTab === "moves") {
    return (
      <section className="h-full w-full overflow-y-auto p-6">
        <MovesTab data={data} />
      </section>
    );
  }

  return (
    <section className="relative h-full w-full p-6">
      <div className="absolute left-4 top-4 z-20 w-80 rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md">
        <h1 className="mb-2 text-2xl font-bold uppercase">{data.name}</h1>
        <h3 className="text-sm uppercase">Type: {data.types.join(" - ")}</h3>
        <h3 className="text-sm uppercase">Evolution: {data.evolutionLevel}</h3>
        <button
          type="button"
          onClick={() => setCurrentTab("evolution")}
          className="mt-4 border border-pokemon-accent px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pokemon-accent"
        >
          See next evolution
        </button>
      </div>

      <div className="absolute bottom-24 left-4 z-20 w-80 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
        <ul className="flex flex-col gap-4">
          {data.stats.map((stat) => (
            <li key={stat.name} className="flex items-center justify-end gap-4 text-xs uppercase text-white">
              <span>
                {stat.name}: {stat.value}
              </span>
              <progress
                max={100}
                value={stat.value}
                className="h-1 w-40 overflow-hidden rounded-full bg-transparent [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-pokemon-accent"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-24 right-4 z-20 w-96 rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md">
        <ul className="flex flex-col gap-2 text-xs uppercase tracking-wider">
          <li className="grid grid-cols-[max-content_1fr] gap-3">
            <span className="text-right">Strong:</span>
            <span>{getBattleStats(data.types, "strength").join(", ") || "None"}</span>
          </li>
          <li className="grid grid-cols-[max-content_1fr] gap-3">
            <span className="text-right">Weak:</span>
            <span>{getBattleStats(data.types, "weakness").join(", ") || "None"}</span>
          </li>
          <li className="grid grid-cols-[max-content_1fr] gap-3">
            <span className="text-right">Resistance:</span>
            <span>{getBattleStats(data.types, "resistance").join(", ") || "None"}</span>
          </li>
          <li className="grid grid-cols-[max-content_1fr] gap-3">
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
          className="absolute -bottom-8 left-0 border border-pokemon-accent px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pokemon-accent"
        >
          Add Pokemon
        </button>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="relative flex h-96 w-96 items-center justify-center rounded-full border-2 border-pokemon-accent">
          <div className="flex h-80 w-80 items-center justify-center rounded-full border-4 border-pokemon-accent">
            <Image
              src={getShinyArtworkUrl(data.id)}
              alt={data.name}
              width={288}
              height={288}
              sizes="(max-width: 1024px) 80vw, 288px"
              className="relative z-10 h-72 w-72 object-contain drop-shadow-2xl"
              onError={(event) => {
                event.currentTarget.src = getOfficialArtworkUrl(data.id);
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-12">
            <div className="h-112 w-1 rotate-45 bg-pokemon-accent" />
            <div className="h-112 w-1 rotate-45 bg-pokemon-accent" />
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
    <ul className="grid max-h-full grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
      {data.encounters.map((encounter) => (
        <li
          key={encounter}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm uppercase text-white"
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
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.pokemonAbilities.abilities.map((ability) => (
            <li key={ability} className="rounded-2xl bg-pokemon-accent p-4 text-center text-sm uppercase text-white">
              {ability}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="mb-3 text-lg font-semibold uppercase text-white">Moves</h2>
        <ul className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
          {data.pokemonAbilities.moves.map((move) => (
            <li key={move} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm uppercase text-white">
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
