import { create } from "zustand";
import type { PokemonCardData } from "@/types/pokemon";

interface CompareState {
  compareQueue: PokemonCardData[];
  addPokemon: (pokemon: PokemonCardData) => void;
  removePokemon: (id: number) => void;
  clearCompare: () => void;
  swapCompare: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  compareQueue: [],
  addPokemon: (pokemon) =>
    set((state) => {
      if (state.compareQueue.some((item) => item.id === pokemon.id)) return state;
      const next = [pokemon, ...state.compareQueue].slice(0, 2);
      return { compareQueue: next };
    }),
  removePokemon: (id) =>
    set((state) => ({ compareQueue: state.compareQueue.filter((item) => item.id !== id) })),
  clearCompare: () => set({ compareQueue: [] }),
  swapCompare: () =>
    set((state) => {
      if (state.compareQueue.length < 2) return state;
      return { compareQueue: [state.compareQueue[1], state.compareQueue[0]] };
    }),
}));
