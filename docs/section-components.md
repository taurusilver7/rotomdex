

## /sections/index.ts

export { default as Navbar } from "./Navbar";
export { default as Wrapper } from "./Wrapper";
export { default as Footer } from "./Footer";


## /sections/Footer.tsx

// Remove firebase/auth and Redux. Tabs are client state in Zustand pokemon UI store.
// Use Next.js navigation and Link.

import { signOut } from "firebase/auth";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setPokemonTab, setToast, setUserStatus } from "../app/slices/AppSlice";
import { pokemonTabs } from "../utils/Constants";
import { firebaseAuth } from "../utils/firebase";

const Footer = () => {
	const location = useLocation();
	const currentPokemonTab = useAppSelector(
		({ app: { currentPokemonTab } }) => currentPokemonTab
	);
	const dispatch = useAppDispatch();

	const logout = () => {
		signOut(firebaseAuth);
		dispatch(setUserStatus(undefined));
		dispatch(setToast("Logged out successfully."));
	};

	const routes = [
		{
			name: pokemonTabs.description,
			value: "description",
		},
		{
			name: pokemonTabs.evolution,
			value: "evolution",
		},
		{
			name: pokemonTabs.locations,
			value: "Catching",
		},
		{
			name: pokemonTabs.moves,
			value: "Capable Moves",
		},
	];
	return (
		<footer>
			<div className="block"></div>
			<div className="data">
				{location.pathname.includes("/pokemon") && (
					<ul>
						{routes.map((route) => (
							<li
								key={route.name}
								className={`${
									currentPokemonTab === route.name ? "active" : ""
								}`}
								onClick={() => dispatch(setPokemonTab(route.name))}
							>
								{route.value}
							</li>
						))}
					</ul>
				)}
			</div>
			<div className="block">
				<MdOutlinePowerSettingsNew onClick={logout} />
			</div>
		</footer>
	);
};

export default Footer;



## Navbar.tsx

// Remove /list route. Remove firebase/auth. Use Next.js Link and usePathname.
// Keep compareQueue badge from Zustand compare store.

import React, { useEffect } from "react";
import pokeballIcon from "../assets/pokeball-icon.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const Navbar = () => {
	const { compareQueue } = useAppSelector(({ pokemon }) => pokemon);
	const location = useLocation();
	const navRoutes = [
		{
			name: "Search",
			route: "/search",
			toast: false,
		},
		{
			name: "Pokemon",
			route: "/pokemon",
			toast: false,
		},
		{
			name: "Compare",
			route: "/compare",
			toast: true,
		},
		{
			name: "Play",
			route: "/play",
			toast: false,
		},
		{
			name: "List",
			route: "/list",
			toast: false,
		},
	];

	const ul = (index: number) => {
		const underline = document.querySelectorAll<HTMLElement>(".underline");
		for (let i = 0; i < underline.length; i++) {
			underline[i].style.transform = "translate3d(" + index * 100 + "%,0,0)";
		}
	};
	useEffect(() => {
		const index = navRoutes.findIndex(({ route }) =>
			location.pathname.includes(route)
		);
		ul(index);
	}, [location.pathname, navRoutes]);

	return (
		<nav>
			<div className="block">
				<img src={pokeballIcon} alt="icon" />
			</div>
			<div className="data">
				<ul>
					<div className="underline"></div>
					<div className="underline"></div>
					<div className="underline"></div>
					{navRoutes.map(({ name, route, toast }, index) => (
						<Link to={route} key={index}>
							<li>{name}</li>
							{toast && compareQueue.length > 0 && (
								<div className="toast-notification">
									{compareQueue?.length}
								</div>
							)}
						</Link>
					))}
				</ul>
			</div>
			<div className="block">
				<GiHamburgerMenu />
			</div>
		</nav>
	);
};

export default Navbar;


## Wrapper.tsx

import React from "react";s

const Wrapper = (Component: React.FC) => () => {
	return (
		<div className="content">
			<Component />
		</div>
	);
};

export default Wrapper;
