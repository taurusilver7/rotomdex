"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Confetti from "react-confetti";
import { usePokemonList } from "@/features/pokemon/hooks/use-pokemon-list";
import { filterPokemonResources } from "@/lib/excluded-pokemon";
import { usePokemonDetail } from "@/features/pokemon/hooks/use-pokemon-detail";
import { Loader } from "@/components/loader";

type PlayStatus = "loading" | "playing" | "correct" | "wrong" | "timeout";
type Difficulty = "none" | "easy" | "normal" | "hard";

const DIFFICULTY_CONFIG: Record<
	Difficulty,
	{ label: string; time: number; hints: boolean; genOneOnly: boolean; timer: boolean }
> = {
	none: { label: "No Timer", time: 0, hints: true, genOneOnly: false, timer: false },
	easy: { label: "Easy", time: 20, hints: true, genOneOnly: true, timer: true },
	normal: { label: "Normal", time: 15, hints: true, genOneOnly: false, timer: true },
	hard: { label: "Hard", time: 10, hints: false, genOneOnly: false, timer: true },
};

function getRandomId(results: { url: string }[]) {
	const index = Math.floor(Math.random() * results.length);
	return Number(results[index].url.split("/").filter(Boolean).pop());
}

function normalizeGuess(value: string) {
	return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function PlayGame() {
	const listQuery = usePokemonList();
	const [difficulty, setDifficulty] = useState<Difficulty>("normal");
	const [targetId, setTargetId] = useState<number | null>(null);
	const [guess, setGuess] = useState("");
	const [status, setStatus] = useState<PlayStatus>("loading");
	const [score, setScore] = useState(0);
	const [hintCount, setHintCount] = useState(0);
	const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG.normal.time);
	const [size, setSize] = useState({ width: 0, height: 0 });

	const detailQuery = usePokemonDetail(targetId ? String(targetId) : "");
	const config = DIFFICULTY_CONFIG[difficulty];

	const availableResults = useMemo(() => {
		const results = filterPokemonResources(listQuery.data?.results ?? []);
		if (!config.genOneOnly) return results;
		return results.filter((pokemon) => {
			const id = Number(pokemon.url.split("/").filter(Boolean).pop());
			return id >= 1 && id <= 151;
		});
	}, [config.genOneOnly, listQuery.data]);

	const pickNextId = useCallback(
		(currentId: number) => {
			if (availableResults.length === 0) return currentId;
			let nextId = getRandomId(availableResults);
			while (nextId === currentId && availableResults.length > 1) {
				nextId = getRandomId(availableResults);
			}
			return nextId;
		},
		[availableResults],
	);

	const resetRound = useCallback(() => {
		setGuess("");
		setHintCount(0);
		setStatus("playing");
		setTargetId((currentId) => pickNextId(currentId ?? -1));
	}, [pickNextId]);

	useEffect(() => {
		const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	useEffect(() => {
		if (targetId === null && availableResults.length > 0) {
			setTargetId(getRandomId(availableResults));
		}
	}, [availableResults, targetId]);

	useEffect(() => {
		if (targetId !== null) resetRound();
		// Intentionally reset only when difficulty changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [difficulty]);

	useEffect(() => {
		if (targetId !== null && detailQuery.data) setStatus("playing");
	}, [targetId, detailQuery.data]);

	useEffect(() => {
		if (!config.timer || status !== "playing") return;

		setTimeLeft(config.time);
		const intervalId = window.setInterval(() => {
			setTimeLeft((previousTime) => {
				if (previousTime <= 1) {
					window.clearInterval(intervalId);
					setScore(0);
					setStatus("timeout");
					return 0;
				}
				return previousTime - 1;
			});
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, [config.time, config.timer, status, targetId]);

	useEffect(() => {
		if (status !== "correct") return;
		const timer = window.setTimeout(() => {
			resetRound();
		}, 2500);
		return () => window.clearTimeout(timer);
	}, [status, resetRound]);

	useEffect(() => {
		if (status !== "timeout") return;
		const timer = window.setTimeout(() => {
			resetRound();
		}, 1500);
		return () => window.clearTimeout(timer);
	}, [status, resetRound]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!detailQuery.data || status === "correct") return;
		if (!guess.trim()) return;

		if (normalizeGuess(guess) === normalizeGuess(detailQuery.data.name)) {
			setScore((currentScore) => currentScore + 1);
			setStatus("correct");
		} else {
			setScore(0);
			setStatus("wrong");
			setGuess("");
		}
	};

	if (listQuery.isLoading || (targetId !== null && detailQuery.isLoading)) {
		return <Loader label="Loading Pokemon" />;
	}

	if (listQuery.isError || detailQuery.isError || !detailQuery.data) {
		return (
			<p className="p-8 text-center text-red-300">
				{listQuery.error?.message ?? detailQuery.error?.message ?? "Failed to load Pokemon."}
			</p>
		);
	}

	const pokemon = detailQuery.data;
	const hints = [
		`First letter: ${pokemon.name.charAt(0).toUpperCase()}`,
		`Type: ${pokemon.types.join(", ")}`,
		`Name length: ${pokemon.name.length} letters`,
	];

	return (
		<section className="flex h-full w-full flex-col items-center justify-center gap-6 px-4">
			{status === "correct" && (
				<Confetti width={size.width} height={size.height} recycle={false} numberOfPieces={220} />
			)}

			<div className="text-center">
				<h1 className="text-3xl font-bold uppercase tracking-wide text-white md:text-5xl">Who&apos;s that Pokemon?</h1>
				<div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-white/80">
					<span>Score: {score}</span>
					<span>Time: {config.timer ? `${timeLeft}s` : "Off"}</span>
					<label className="flex items-center gap-2">
						<span className="uppercase tracking-widest">Difficulty</span>
						<select
							value={difficulty}
							onChange={(event) => setDifficulty(event.target.value as Difficulty)}
							className="rounded-lg border border-white/20 bg-black/70 px-3 py-1 text-white outline-none focus:border-pokemon-accent"
						>
							{(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((level) => (
								<option key={level} value={level} className="bg-black text-white">
									{DIFFICULTY_CONFIG[level].label}
								</option>
							))}
						</select>
					</label>
				</div>
			</div>

			<div className="relative flex h-72 w-72 items-center justify-center md:h-96 md:w-96">
				<Image
					src={pokemon.image}
					alt={status === "correct" ? pokemon.name : "Pokemon silhouette"}
					width={384}
					height={384}
					priority
					className={`h-64 w-64 object-contain transition-all duration-500 md:h-80 md:w-80 ${
						status === "correct" ? "scale-110 brightness-100" : "scale-100 brightness-0 invert"
					}`}
				/>
				{status === "correct" && (
					<h2 className="absolute bottom-0 text-2xl font-bold uppercase text-white drop-shadow-lg">
						{pokemon.name}
					</h2>
				)}
			</div>

			{config.hints && hintCount > 0 && (
				<ul className="w-full max-w-md space-y-1 text-center text-sm uppercase tracking-widest text-white/80">
					{hints.slice(0, hintCount).map((hint) => (
						<li key={hint}>{hint}</li>
					))}
				</ul>
			)}

			<form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
				<input
					type="text"
					value={guess}
					onChange={(event) => setGuess(event.target.value)}
					placeholder="Which Pokemon is this?"
					aria-label="Pokemon name"
					className="h-12 flex-1 rounded-xl bg-white/10 px-4 text-white outline-none placeholder:text-white/60"
				/>
				<button
					type="submit"
					disabled={status === "correct"}
					className="h-12 rounded-xl border border-pokemon-accent px-6 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pokemon-accent disabled:cursor-not-allowed disabled:opacity-40"
				>
					Submit
				</button>
				<button
					type="button"
					onClick={() => setHintCount((count) => Math.min(count + 1, hints.length))}
					disabled={!config.hints || hintCount >= hints.length || status !== "playing"}
					className="h-12 rounded-xl border border-white/20 px-6 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Hint
				</button>
				<button
					type="button"
					onClick={resetRound}
					className="h-12 rounded-xl border border-white/20 px-6 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/10"
				>
					{status === "correct" ? "Try Again" : "Skip"}
				</button>
			</form>

			<p aria-live="polite" className="min-h-6 text-sm uppercase tracking-widest text-white/80">
				{status === "timeout"
					? "Time's up. Loading next Pokemon."
					: status === "wrong"
						? "Try again."
						: status === "correct"
							? "Correct!"
							: ""}
			</p>
		</section>
	);
}