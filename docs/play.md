# page.js

"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard";

export default function Home() {
const [pokemon, setPokemon] = useState(null);
const [currentPokemon, setCurrentPokemon] = useState(null);
const [loading, setLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [score, setScore] = useState(0);
const [guess, setGuess] = useState("");
const [isCorrect, setIsCorrect] = useState(false);

    const getPokemon = async () => {
    	setLoading(true);

    	try {
    		const data = await axios.get("/api/pokemon");
    		// console.log(data);
    		setPokemon(data.data);
    		setLoading(false);
    	} catch (error) {
    		console.log(error);
    		setIsError(true);
    		setLoading(false);
    	}
    };

    useEffect(() => {
    	getPokemon();
    }, []);

    const handleSubmit = (e) => {
    	e.preventDefault();

    	if (!guess) return;
    	if (guess.toLowerCase() === currentPokemon.name) {
    		setScore(score + 1);
    		setGuess("");
    		setIsCorrect(true);
    		setTimeout(() => {
    			setIsCorrect(false);
    			getPokemon();
    		}, 2000);
    	} else {
    		setGuess("");
    	}
    };

    useEffect(() => {
    	if (pokemon && !isError && !loading && pokemon.results) {
    		// console.log(pokemon.results);
    		const randomPokemon = Math.floor(
    			Math.random() * pokemon.results.length
    		);
    		setCurrentPokemon(pokemon.results[randomPokemon]);
    	}
    }, [pokemon]);

    useEffect(() => {
    	console.log(currentPokemon);
    }, [currentPokemon]);

    if (loading) {
    	const statusMessage = loading ? "Searching..." : "Error!";
    	return (
    		<main className="flex flex-col items-center justify-center h-screen min-h-screen py-2">
    			<h1 className="text-6xl font-bold">{statusMessage}</h1>
    		</main>
    	);
    }

    return (
    	<main className="flex flex-col items-center min-h-screen gap-12 p-24">
    		{isError && (
    			<div
    				className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
    				role="alert"
    			>
    				<strong className="font-bold">Error!</strong>
    				<span className="block sm:inline">
    					Something went wrong. Please try again later.
    				</span>
    			</div>
    		)}

    		<h1 className="text-2xl font-bold md:text-4xl">Who's that Pokemon?</h1>
    		<h2 className="text-3xl font-bold">Score: {score}</h2>

    		<div className="flex flex-col items-center gap-24 md:flex-row justify-evenly">
    			<PokemonCard pokemon={currentPokemon} isCorrect={isCorrect} />
    			<form
    				className="w-full max-w-md"
    				onSubmit={handleSubmit}
    				style={{ marginTop: "2rem" }}
    			>
    				<div className="flex items-center flex-1 py-2 border-b border-teal-500">
    					<input
    						className="w-full p-4 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
    						type="text"
    						placeholder="Which Pokemon is this?"
    						aria-label="Full name"
    						onChange={(e) => setGuess(e.target.value)}
    						value={guess}
    					/>
    					<button
    						className="flex-shrink-0 p-2 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700"
    						type="submit"
    					>
    						Submit
    					</button>
    					<button
    						className="flex-shrink-0 p-2 mx-1 text-sm text-teal-500 border-4 border-transparent rounded hover:text-teal-800"
    						type="button"
    						onClick={() => {
    							setGuess("");
    							getPokemon();
    						}}
    					>
    						Skip
    					</button>
    				</div>
    			</form>
    		</div>
    	</main>
    );

}

# api/pokemon/route.js

import axios from "axios";
import { NextResponse } from "next/server";

const getRandomPokemon = async () => {
try {
const data = await axios.get(
`https://pokeapi.co/api/v2/pokemon?limit=100`
);
return data;
} catch (error) {
return error;
}
};

export async function GET() {
try {
const pokemon = await getRandomPokemon();
return NextResponse.json(pokemon.data);
} catch (error) {
return NextResponse.json(500, error);
}
}

# components/PokemonCard.jsx

"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const PokemonCard = ({ pokemon, isCorrect }) => {
const [data, setData] = useState({});

    useEffect(() => {
    	try {
    		const fetchData = async () => {
    			if (!pokemon) return;
    			const result = await axios.get(pokemon.url);
    			setData(result.data);
    		};
    		fetchData();
    	} catch (error) {
    		console.log(error);
    	}
    }, [pokemon]);

    return (
    	<div className="relative flex flex-col-reverse items-center min-w-fit">
    		<img
    			src={data?.sprites?.other?.home?.front_default}
    			alt={"loading image"}
    			className={isCorrect ? "correct" : "incorrect"}
    			style={{
    				paddingBottom: "50px",
    				height: "300px",
    			}}
    		/>

    		{isCorrect && (
    			<h2 className="absolute bottom-0 left-0 my-4 text-xl font-semibold">
    				{data?.name}
    			</h2>
    		)}
    	</div>
    );

};

export default PokemonCard;
