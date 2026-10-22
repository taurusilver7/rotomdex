
## /components./Info.tsx

// Remove Redux dispatch. Compare action should call Zustand compare store.
// Types must be strict; no @ts-ignore.

import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { addPokemonToList } from "../app/reducers/addPokemonToList";
import { setPokemonTab } from "../app/slices/AppSlice";
import { pokemonTypes } from "../utils";
import { pokemonTabs } from "../utils/Constants";
import { currentPokemonType, pokemonStatsType } from "../utils/Types";

const Info = ({ data }: { data: currentPokemonType | undefined }) => {
	const dispatch = useAppDispatch();
	// console.log(data);

	useEffect(() => {
		const progressBar = document.querySelectorAll("progress");
		progressBar.forEach((bar) => {
			bar.style.width = "10rem";
		});
	}, []);

	const createStatsArray = (types: string[], statType: string) => {
		const statSet = new Set();
		types.forEach((type: string) => {
			// @ts-ignore
			pokemonTypes[type][statType].forEach((stat: strin) => {
				if (!statSet.has(stat)) {
					statSet.add(stat[0].toUpperCase() + stat.slice(1));
				}
			});
		});
		return Array.from(statSet);
	};

	return (
		<>
			<div className="details">
				<h1 className="name">{data?.name}</h1>
				<h3>Type: {data?.types.join(" - ")}</h3>
				<h3>Evolution: {data?.evolutionLevel}</h3>
				<button
					onClick={() => dispatch(setPokemonTab(pokemonTabs.evolution))}
				>
					See next evolution
				</button>
			</div>

			<div className="stats">
				<ul>
					{data?.stats.map((stat: pokemonStatsType) => (
						<li key={stat.name}>
							{stat.name}: {stat.value}
							<progress max={100} value={stat.value} />
						</li>
					))}
				</ul>
			</div>

			<div className="battle-stats">
				{
					<ul>
						<li>
							<span>Strong: </span>
							<span>
								{createStatsArray(
									data?.types as unknown as string[],
									"strength"
								).join(", ")}
							</span>
						</li>
						<li>
							<span>Weak: </span>
							<span>
								{createStatsArray(
									data?.types as unknown as string[],
									"weakness"
								).join(", ")}
							</span>
						</li>
						<li>
							<span>Resistance: </span>
							<span>
								{createStatsArray(
									data?.types as unknown as string[],
									"resistance"
								).join(", ")}
							</span>
						</li>
						<li>
							<span>Vulnerable: </span>
							<span>
								{createStatsArray(
									data?.types as unknown as string[],
									"vulnerable"
								).join(", ")}
							</span>
						</li>
					</ul>
				}
				<button
					className="add-pokemon"
					onClick={() => dispatch(addPokemonToList(data!))}
				>
					Add Pokemon
				</button>
			</div>
		</>
	);
};

export default Info;


## components/PokemonContainer.tsx


import React from "react";
import pikachu from "../assets/pikachu.png";

const PokemonContainer = ({ image }: { image: string }) => {
	return (
		<>
			<div className="circle-container">
				<div className="outer-circle">
					<div className="inner-circle">
						<img className="inneer-circle-pokemon" src={image} alt="pokemon" />
					</div>

					<div className="lines">
						<div className="line line-1"></div>
						<div className="line line-2"></div>
					</div>
				</div>
			</div>

			{/* <div className="circle-container circle-container-2">
				<div className="outer-circle">
					<div className="inner-circle">
						<img src={pikachu} alt="" />
					</div>
					<div className="lines">
						<div className="line line-1"></div>
						<div className="line line-2"></div>
					</div>
				</div>
			</div> */}
		</>
	);
};

export default PokemonContainer;


## pages/Pokémon.tsx

// @ts-nocheck
import axios from "axios";
import { extractColors } from "extract-colors";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setPokemonTab } from "../app/slices/AppSlice";
import { setCurrentPokemon } from "../app/slices/PokeSlice";
import { Loader } from "../components";
import { Wrapper } from "../sections";
import { defaultImages, images } from "../utils";
import {
	pokemonSpeciesRoute,
	pokemonTabs,
	pokeRoute,
} from "../utils/Constants";
import CapableMoves from "./pokemon/CapableMoves";
import Description from "./pokemon/Description";
import Evolution from "./pokemon/Evolution";
import Locations from "./pokemon/Locations";

const Pokemon = () => {
	const params = useParams();
	const dispatch = useAppDispatch();
	const currentPokemon = useAppSelector(
		({ pokemon: { currentPokemon } }) => currentPokemon
	);
	const currentPokemonTab = useAppSelector(
		({ app: { currentPokemonTab } }) => currentPokemonTab
	);

	const [dataLoading, setDataLoading] = useState(true);

	useEffect(() => {
		dispatch(setPokemonTab(pokemonTabs.description));
	}, [dispatch]);

	const getRecursiveEvolution = useCallback(
		(evolutionChain, level, evolutionData) => {
			if (!evolutionChain.evolves_to.length) {
				return evolutionData.push({
					pokemon: {
						...evolutionChain.species,
						url: evolutionChain.species.url.replace(
							"pokemon-species",
							"pokemon"
						),
					},
					level,
				});
			}

			evolutionData.push({
				pokemon: {
					...evolutionChain.species,
					url: evolutionChain.species.url.replace(
						"pokemon-species",
						"pokemon"
					),
				},
				level,
			});

			return getRecursiveEvolution(
				evolutionChain.evolves_to[0],
				level + 1,
				evolutionData
			);
		},
		[]
	);

	// A callback function to obtain evolution data of a pokemon
	const getEvolutionData = useCallback(
		(evolutioChain) => {
			const evolutionData = [];
			getRecursiveEvolution(evolutioChain, 1, evolutionData);
			return evolutionData;
		},
		[getRecursiveEvolution]
	);

	// Function to get pokemon data from the api
	const getPokemonInfo = useCallback(
		async (image) => {
			const { data } = await axios.get(`${pokeRoute}/${params.id}`);
			// console.log("pokemonData", data);

			// Pokemon abilities from data
			const pokemonAbilities = {
				abilities: data.abilities.map(({ ability }) => ability.name),
				moves: data.moves.map(({ move }) => move.name),
			};

			// search_locations, sub-species, evolution-details
			const { data: dataEncounters } = await axios.get(
				data.location_area_encounters
			);

			const {
				data: {
					evolution_chain: { url: evolutionURL },
				},
			} = await axios.get(`${pokemonSpeciesRoute}/${data.id}`);
			const { data: evolutionData } = await axios.get(evolutionURL);

			// console.log("EvolutionData", evolutionData);

			// A function to get evolution data from the evaluation_chain
			const evolution = getEvolutionData(evolutionData.chain);
			// console.log("evolution", evolution);

			let evolutionLevel;
			evolutionLevel = evolution.find(
				({ pokemon }) => pokemon.name === data.name
			).level;

			const encounters = [];
			dataEncounters.forEach((encounter) => {
				// console.log("encounter", encounter);
				encounters.push(
					encounter.location_area.name.toUpperCase().split("-").join(" ")
				);
			});

			const stats = await data.stats.map(({ stat, base_stat }) => ({
				name: stat.name,
				value: base_stat,
			}));

			// dispatch the pokemon data to pokeSlice
			dispatch(
				setCurrentPokemon({
					id: data.id,
					name: data.name,
					types: data.types.map(({ type: { name } }) => name),
					image,
					stats,
					encounters,
					evolutionLevel,
					evolution,
					pokemonAbilities,
				})
			);
			setDataLoading(false);
		},
		[params.id, dispatch, getEvolutionData]
	);

	useEffect(() => {
		const imgElement = document.createElement("img");
		imgElement.src = images[params.id];

		// A extract-colors customized options property
		const options = {
			pixels: 10000,
			distance: 1,
			splitPower: 10,
			colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
			saturationDistance: 0.2,
			lightnessDistance: 0.2,
			hueDistance: 0.083333333,
		};

		// A function to set the accent property color of the application
		const getColor = async () => {
			const color = await extractColors(imgElement.src, options);
			const root = document.documentElement;
			root.style.setProperty("--accent-color", color[0].hex.split('"')[0]);
		};
		getColor();

		let image = images[params.id];
		if (!image) {
			image = defaultImages[params.id];
		}

		getPokemonInfo(image);
	}, [params.id, getPokemonInfo]);

	return (
		<>
			{!dataLoading && currentPokemon ? (
				<>
					{currentPokemonTab === pokemonTabs.description && (
						<Description />
					)}
					{currentPokemonTab === pokemonTabs.evolution && <Evolution />}
					{currentPokemonTab === pokemonTabs.locations && <Locations />}
					{currentPokemonTab === pokemonTabs.moves && <CapableMoves />}
				</>
			) : (
				<Loader />
			)}
		</>
	);
};

export default Wrapper(Pokemon);


/pages/pokemon/CapableMoves.tsx

// @ts-nocheck
import axios from "axios";
import { extractColors } from "extract-colors";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setPokemonTab } from "../app/slices/AppSlice";
import { setCurrentPokemon } from "../app/slices/PokeSlice";
import { Loader } from "../components";
import { Wrapper } from "../sections";
import { defaultImages, images } from "../utils";
import {
	pokemonSpeciesRoute,
	pokemonTabs,
	pokeRoute,
} from "../utils/Constants";
import CapableMoves from "./pokemon/CapableMoves";
import Description from "./pokemon/Description";
import Evolution from "./pokemon/Evolution";
import Locations from "./pokemon/Locations";

const Pokemon = () => {
	const params = useParams();
	const dispatch = useAppDispatch();
	const currentPokemon = useAppSelector(
		({ pokemon: { currentPokemon } }) => currentPokemon
	);
	const currentPokemonTab = useAppSelector(
		({ app: { currentPokemonTab } }) => currentPokemonTab
	);

	const [dataLoading, setDataLoading] = useState(true);

	useEffect(() => {
		dispatch(setPokemonTab(pokemonTabs.description));
	}, [dispatch]);

	const getRecursiveEvolution = useCallback(
		(evolutionChain, level, evolutionData) => {
			if (!evolutionChain.evolves_to.length) {
				return evolutionData.push({
					pokemon: {
						...evolutionChain.species,
						url: evolutionChain.species.url.replace(
							"pokemon-species",
							"pokemon"
						),
					},
					level,
				});
			}

			evolutionData.push({
				pokemon: {
					...evolutionChain.species,
					url: evolutionChain.species.url.replace(
						"pokemon-species",
						"pokemon"
					),
				},
				level,
			});

			return getRecursiveEvolution(
				evolutionChain.evolves_to[0],
				level + 1,
				evolutionData
			);
		},
		[]
	);

	// A callback function to obtain evolution data of a pokemon
	const getEvolutionData = useCallback(
		(evolutioChain) => {
			const evolutionData = [];
			getRecursiveEvolution(evolutioChain, 1, evolutionData);
			return evolutionData;
		},
		[getRecursiveEvolution]
	);

	// Function to get pokemon data from the api
	const getPokemonInfo = useCallback(
		async (image) => {
			const { data } = await axios.get(`${pokeRoute}/${params.id}`);
			// console.log("pokemonData", data);

			// Pokemon abilities from data
			const pokemonAbilities = {
				abilities: data.abilities.map(({ ability }) => ability.name),
				moves: data.moves.map(({ move }) => move.name),
			};

			// search_locations, sub-species, evolution-details
			const { data: dataEncounters } = await axios.get(
				data.location_area_encounters
			);

			const {
				data: {
					evolution_chain: { url: evolutionURL },
				},
			} = await axios.get(`${pokemonSpeciesRoute}/${data.id}`);
			const { data: evolutionData } = await axios.get(evolutionURL);

			// console.log("EvolutionData", evolutionData);

			// A function to get evolution data from the evaluation_chain
			const evolution = getEvolutionData(evolutionData.chain);
			// console.log("evolution", evolution);

			let evolutionLevel;
			evolutionLevel = evolution.find(
				({ pokemon }) => pokemon.name === data.name
			).level;

			const encounters = [];
			dataEncounters.forEach((encounter) => {
				// console.log("encounter", encounter);
				encounters.push(
					encounter.location_area.name.toUpperCase().split("-").join(" ")
				);
			});

			const stats = await data.stats.map(({ stat, base_stat }) => ({
				name: stat.name,
				value: base_stat,
			}));

			// dispatch the pokemon data to pokeSlice
			dispatch(
				setCurrentPokemon({
					id: data.id,
					name: data.name,
					types: data.types.map(({ type: { name } }) => name),
					image,
					stats,
					encounters,
					evolutionLevel,
					evolution,
					pokemonAbilities,
				})
			);
			setDataLoading(false);
		},
		[params.id, dispatch, getEvolutionData]
	);

	useEffect(() => {
		const imgElement = document.createElement("img");
		imgElement.src = images[params.id];

		// A extract-colors customized options property
		const options = {
			pixels: 10000,
			distance: 1,
			splitPower: 10,
			colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
			saturationDistance: 0.2,
			lightnessDistance: 0.2,
			hueDistance: 0.083333333,
		};

		// A function to set the accent property color of the application
		const getColor = async () => {
			const color = await extractColors(imgElement.src, options);
			const root = document.documentElement;
			root.style.setProperty("--accent-color", color[0].hex.split('"')[0]);
		};
		getColor();

		let image = images[params.id];
		if (!image) {
			image = defaultImages[params.id];
		}

		getPokemonInfo(image);
	}, [params.id, getPokemonInfo]);

	return (
		<>
			{!dataLoading && currentPokemon ? (
				<>
					{currentPokemonTab === pokemonTabs.description && (
						<Description />
					)}
					{currentPokemonTab === pokemonTabs.evolution && <Evolution />}
					{currentPokemonTab === pokemonTabs.locations && <Locations />}
					{currentPokemonTab === pokemonTabs.moves && <CapableMoves />}
				</>
			) : (
				<Loader />
			)}
		</>
	);
};

export default Wrapper(Pokemon);


/pages/pokemon/Evolution.tsx


import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getPokemonData } from "../../app/reducers/getPokemonData";
import { CardGrid, Loader } from "../../components";
import { genericPokemonType } from "../../utils/Types";

const Evolution = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const dispatch = useAppDispatch();
	const { currentPokemon, randomPokemon } = useAppSelector(
		({ pokemon }) => pokemon
	);

	// console.log("randomPokemon", randomPokemon);

	useEffect(() => {
		const fetchData = async () => {
			const pokemons: genericPokemonType[] = currentPokemon!.evolution.map(
				({ pokemon }: { pokemon: genericPokemonType }) => pokemon
			);
			await dispatch(getPokemonData(pokemons));
			setIsLoaded(true);
		};
		fetchData();
	}, [dispatch, currentPokemon]);

	return (
		<div className="page">
			{isLoaded ? <CardGrid pokemons={randomPokemon!} /> : <Loader />}
		</div>
	);
};

export default Evolution;


/pages/pokemon/Location.tsx


import React from "react";
import { useAppSelector } from "../../app/hooks";

const Locations = () => {
	const { currentPokemon } = useAppSelector(({ pokemon }) => pokemon);

	return (
		<div className="locations">
			<div className="locations-list">
				{currentPokemon?.encounters.map((encounter: string) => (
					<li className="location" key={encounter}>
						{encounter}
					</li>
				))}
			</div>
		</div>
	);
};

export default Locations;







