
the entire redux store, reducers, slices and hooks

## /app/store.ts

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { AppSlice } from "./slices/AppSlice";
import { PokeSlice } from "./slices/PokeSlice";

export const store = configureStore({
	reducer: {
		app: AppSlice.reducer,
		pokemon: PokeSlice.reducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;


## /app/hooks.ts

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


## /app/slices/AppSlice.tsx

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pokemonTabs } from "../../utils/Constants";
import { AppInitialStateType } from "../../utils/Types";

const initialState: AppInitialStateType = {
	toasts: [],
	userInfo: undefined,
	isLoading: true,
	currentPokemonTab: pokemonTabs.description,
};

export const AppSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setToast: (state, action) => {
			const toasts = [...state.toasts];
			toasts.push(action.payload);
			state.toasts = toasts;
		},
		clearToast: (state) => {
			state.toasts = [];
		},
		setUserStatus: (
			state,
			action: PayloadAction<{ email: string } | undefined>
		) => {
			state.userInfo = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setPokemonTab: (state, action) => {
			state.currentPokemonTab = action.payload;
		},
	},
});

export const {
	setToast,
	clearToast,
	setLoading,
	setUserStatus,
	setPokemonTab,
} = AppSlice.actions;


## app/slices/PokeSlice.tsx

import { createSlice } from "@reduxjs/toolkit";
import {
	generatedPokemonType,
	PokemonInitialStateType,
} from "../../utils/Types";
import { getInitalData } from "../reducers/getInitialData";
import { getPokemonData } from "../reducers/getPokemonData";
import { getUserPokemon } from "../reducers/getUserPokemon";
import { removePokemonFromList } from "../reducers/removePokemonFromList";

const initialState: PokemonInitialStateType = {
	allPokemon: undefined,
	randomPokemon: undefined,
	compareQueue: [],
	userPokemons: [],
	currentPokemon: undefined,
};

export const PokeSlice = createSlice({
	name: "pokemon",
	initialState,
	reducers: {
		addToCompare: (state, action) => {
			// see if there pokemon inside the compare to avoid multiple additions.
			const index = state.compareQueue?.findIndex(
				(pokemon: generatedPokemonType) => pokemon.id === action.payload.id
			);
			if (index === -1) {
				if (state.compareQueue!.length === 2) {
					// if the compare has more than 2 values, pop the last one out
					state.compareQueue?.pop();
				}
				// add the pokemon as zeroth element if compare is empty
				state.compareQueue?.unshift(action.payload);
			}
		},
		removeFromCompare: (state, action) => {
			const index = state.compareQueue?.findIndex(
				(pokemon: generatedPokemonType) => pokemon.id === action.payload.id
			);
			const queue = [...state.compareQueue!];
			// Pull the index element from the array & reorder the array to compareQueue w/o index element.
			queue.splice(index, 1);
			state.compareQueue = queue;
		},
		setCurrentPokemon: (state, action) => {
			state.currentPokemon = action.payload;
		},
		resetRandomPokemon: (state) => {
			state.randomPokemon = undefined;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getInitalData.fulfilled, (state, action) => {
			state.allPokemon = action.payload;
		});
		builder.addCase(getPokemonData.fulfilled, (state, action) => {
			state.randomPokemon = action.payload;
		});
		builder.addCase(getUserPokemon.fulfilled, (state, action) => {
			state.userPokemons = action.payload!;
		});
		builder.addCase(removePokemonFromList.fulfilled, (state, action) => {
			const userPokemons = [...state.userPokemons];
			const index = userPokemons.findIndex(
				(pokemon) => pokemon.firebaseId === action.payload?.id
			);
			userPokemons.splice(index, 1);
			state.userPokemons = userPokemons;
		});
	},
});

export const {
	addToCompare,
	removeFromCompare,
	setCurrentPokemon,
	resetRandomPokemon,
} = PokeSlice.actions;


/app/reducers/getInitialData.ts

// Get pokemon data from the api for the search page.

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pokemonRoute } from "../../utils/Constants";

export const getInitalData = createAsyncThunk(
	"/pokemon/initialData",
	async () => {
		try {
			// Make API request
			const { data } = await axios.get(pokemonRoute);
			// console.log({ data });
			return data.results;
		} catch (error) {
			console.log({ error });
		}
	}
);


/app/reducers/getPokemonData.ts

// Get random pokemon data from the api

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { defaultImages, images, pokemonTypes } from "../../utils";

import { generatedPokemonType, genericPokemonType } from "../../utils/Types";

export const getPokemonData = createAsyncThunk(
	"/pokemon/randomPokemon",
	async (pokemons: genericPokemonType[]) => {
		try {
			// Make API request
			const pokemonData: generatedPokemonType[] = [];
			for await (const pokemon of pokemons) {
				const {
					data,
				}: {
					data: { id: number; types: { type: generatedPokemonType }[] };
				} = await axios.get(pokemon.url);

				const types = data.types.map(
					({ type: { name } }: { type: { name: string } }) => ({
						// @ts-expect-error
						[name]: pokemonTypes[name],
					})
				);
				// @ts-expect-error
				let image: string = images[data.id];

				if (!image) {
					// @ts-expect-error
					image = defaultImages[data.id];
				}
				if (image) {
					pokemonData.push({
						name: pokemon.name,
						id: data.id,
						image,
						types,
					});
				}
			}
			// console.log(pokemonData)
			return pokemonData;
		} catch (error) {
			console.log(error);
		}
	}
);


addPokemontoList, removePokemonToList, getUserPokemon are removed from the files since /list is being removed with authentication.