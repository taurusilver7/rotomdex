import { create } from "zustand";

interface ThemeState {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  accentColor: "#f51313",
  setAccentColor: (color) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--pokemon-accent", color);
    }
    set({ accentColor: color });
  },
}));
