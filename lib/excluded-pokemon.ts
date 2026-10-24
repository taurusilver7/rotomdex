export const EXCLUDED_POKEMON_IDS = new Set<number>([10264, 10266, 10268, 10270]);

export function isPokemonExcluded(id: number | string): boolean {
	const numericId = typeof id === "string" ? Number(id) : id;
	return Number.isFinite(numericId) && EXCLUDED_POKEMON_IDS.has(numericId);
}

export function getPokemonIdFromResource(resource: { url: string }): number {
	return Number(resource.url.split("/").filter(Boolean).pop());
}

export function filterPokemonResources<T extends { url: string }>(resources: T[]): T[] {
	return resources.filter((resource) => !isPokemonExcluded(getPokemonIdFromResource(resource)));
}
