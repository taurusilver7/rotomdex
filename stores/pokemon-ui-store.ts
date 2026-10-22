import { create } from "zustand";
import type { PokemonTab } from "@/types/pokemon";

interface PokemonUiState {
  currentTab: PokemonTab;
  setCurrentTab: (tab: PokemonTab) => void;
}

export const usePokemonUiStore = create<PokemonUiState>((set) => ({
  currentTab: "description",
  setCurrentTab: (tab) => set({ currentTab: tab }),
}));
