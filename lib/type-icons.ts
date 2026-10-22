const TYPE_ICON_EXTENSIONS: Record<string, "png" | "svg"> = {
  bug: "png",
  dark: "svg",
  dragon: "png",
  electric: "svg",
  fairy: "svg",
  fighting: "svg",
  fire: "png",
  flying: "png",
  ghost: "png",
  grass: "png",
  ground: "svg",
  ice: "svg",
  normal: "svg",
  poison: "svg",
  psychic: "svg",
  rock: "svg",
  steel: "svg",
  water: "svg",
};

export function getTypeIconUrl(type: string) {
  const extension = TYPE_ICON_EXTENSIONS[type.toLowerCase()] ?? "svg";
  return `/types/${type.toLowerCase()}.${extension}`;
}
