import { create } from "zustand";
import { getContrastColor } from "@/lib/color-contrast";

interface ThemeState {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  accentColor: "#f51313",
  setAccentColor: (color) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--pokemon-accent", color);
      document.documentElement.style.setProperty("--pokemon-accent-contrast", getContrastColor(color));
    }
    set({ accentColor: color });
  },
}));
