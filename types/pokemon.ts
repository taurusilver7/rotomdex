export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedApiResource;
}

export interface PokemonStat {
  base_stat: number;
  stat: NamedApiResource;
}

export interface PokemonAbilitySlot {
  ability: NamedApiResource;
  is_hidden: boolean;
}

export interface PokemonMoveSlot {
  move: NamedApiResource;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbilitySlot[];
  moves: PokemonMoveSlot[];
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: { front_default: string | null; front_shiny: string | null };
      home?: { front_default: string | null; front_shiny: string | null };
    };
  };
  location_area_encounters: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  evolution_chain: { url: string };
}

export interface EvolutionNode {
  species: NamedApiResource;
  evolves_to: EvolutionNode[];
}

export interface EvolutionChain {
  chain: EvolutionNode;
}

export interface PokemonEncounter {
  location_area: NamedApiResource;
}

export interface PokemonCardData {
  name: string;
  id: number;
  image: string;
  types: string[];
}

export type PokemonTab = "description" | "evolution" | "locations" | "moves";

export interface CurrentPokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
  stats: { name: string; value: number }[];
  encounters: string[];
  evolutionLevel: number;
  evolution: { level: number; pokemon: { name: string; url: string } }[];
  pokemonAbilities: { abilities: string[]; moves: string[] };
}
