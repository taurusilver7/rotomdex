import type { EvolutionChain, EvolutionNode } from "@/types/pokemon";

export interface EvolutionEntry {
  level: number;
  pokemon: { name: string; url: string };
}

export function collectEvolution(node: EvolutionNode, level: number, acc: EvolutionEntry[] = []): EvolutionEntry[] {
  acc.push({
    level,
    pokemon: {
      name: node.species.name,
      url: node.species.url.replace("pokemon-species", "pokemon"),
    },
  });

  for (const child of node.evolves_to ?? []) {
    collectEvolution(child, level + 1, acc);
  }

  return acc;
}

export function getEvolutionEntries(chain: EvolutionChain["chain"]) {
  return collectEvolution(chain, 1, []);
}

export function getCurrentEvolutionLevel(entries: EvolutionEntry[], pokemonName: string) {
  return entries.find((entry) => entry.pokemon.name === pokemonName)?.level ?? 1;
}
