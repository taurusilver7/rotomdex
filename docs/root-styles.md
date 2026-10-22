the SCSS follow the following routing structure.

inside the /scss folder:

index.scss, /base, /components, /pages, /sections, /utils

# index.scss

@import "utils";
@import "base";
@import "components";
@import "sections";
@import "pages";


## /utils/_variables.scss

$bg-color: rgba(255, 93, 93, 0);
$dot-color: rgba(255, 255, 255, 0.051);

// Dimensions
$dot-size: 1.5px;
$dot-space: 22px;

## /utils/_index.scss

@import "variables";


#3 /base/_index.scss

@import "./app";
@import "./base";


## /base/_app.scss

.main-container {
	position: relative;
	max-width: 100vw;
	height: 100vh;
	overflow: hidden;
}
.app {
	z-index: 1;
	background: rgba(4, 6, 20, 0.85);
	box-shadow: 0 8px 32px 0 rgba(6, 8, 28, 0.37);
	height: 100vh;
	width: 100vw;
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	border: 1px solid rgba(23, 20, 20, 0.37);
	display: grid;
	grid-template-rows: 10vh auto 10vh;
	grid-template-columns: 1fr;
	.content {
		margin: 0 5rem;
		border: 0.5px solid rgba(255, 255, 255, 0.203);
		border-top: none;
		border-bottom: none;
		height: 80vh;
		background-color: rgba(255, 255, 255, 0.052);
		overflow: hidden;
	}
}

.page {
	height: 100%;
	width: 100%;
}

button {
	cursor: pointer;
}

::-webkit-scrollbar {
	background-color: transparent;
	width: 0.4rem;
	&-thumb {
		background-color: rgba(219, 219, 219, 0.557);
	}
}


## /base/-base.scss

@use "sass:color";

@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;700&display=swap");

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	background-color: black;
	font-family: "Raleway", sans-serif;
}

#root {
	$accent-color: #f51313;
	--accent-dark: color.scale($accent-color, $lightness: -30%);
}


## /components/_index.scss

@import "background";
@import "card_grid";
@import "compare_container";
@import "login";
@import "loader";
@import "info";
@import "pokemon_container";
@import "pokemon_card";


## /components/background.scss

.background {
   z-index: -1;
   position: absolute;
   max-height: 100vh;
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
   gap: 2rem;
   img {
      max-inline-size: 100%;
      block-size: auto;
      height: 20rem;
   }
}

## /components/card_grid.scss

.card-grid-container {
	max-height: 80vh;
	overflow-y: scroll;
	padding-bottom: 2rem;
	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin: 2rem;
		margin-top: 2rem;
		.card {
			width: 250px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: rgba(255, 255, 255, 0.125);
			backdrop-filter: blur(10px);
			border-radius: 1rem;
			padding: 1rem;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			position: relative;
			&:hover {
				backdrop-filter: invert(5%);
				-webkit-backdrop-filter: invert(5%);
			}
			svg {
				transition: 0.3s ease-in-out;
				&:hover {
					font-size: 2rem;
				}
			}
			&-list {
				position: absolute;
				top: 0.7rem;
				left: 0.8rem;
				font-size: 1rem;
				cursor: pointer;
				.trash {
					color: #e21b5a;
				}
				.plus {
					color: #27af0f;
				}
			}
			&-compare {
				position: absolute;
				top: 0.5rem;
				right: 0.8rem;
				font-size: 1.3rem;
				cursor: pointer;
				svg {
					color: #1f51ff;
				}
			}
			&-title {
				text-align: center;
				cursor: pointer;
				margin-top: 1rem;
			}
			&-image {
				height: 12rem;
				filter: drop-shadow(20px 10px 10px #14121281);
				cursor: pointer;
			}
			&-types {
				width: 100%;
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
				gap: 1rem;
				&_type {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin-top: 0.5rem;
					gap: 0.4rem;
				}
				&_image {
					height: 2rem;
				}
				&_text {
					font-size: smaller;
				}
			}
		}
	}
}

@media only screen and (max-width: 680px) {
	.card-grid {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}
	.card {
		width: 200px;
	}
	.card-image {
		height: 10rem;
	}
}


## /components/_compare_container.scss

.compare-container {
	height: 100%;
	width: 100%;
	.empty {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		height: 100%;
		button {
			cursor: pointer;
			border-radius: 10rem;
			padding: 2rem;
			margin: 1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			border: none;
			background-color: var(--accent-color);
			transition: all 0.2s;
			svg {
				font-size: 5rem;
				color: whitesmoke;
			}
			&:hover {
				transform: scale(1.05);
			}
		}
		h3 {
			color: white;
			text-transform: uppercase;
			text-align: center;
			letter-spacing: 0.3rem;
		}
	}
}

.compare-element {
	height: 100%;
	display: grid;
	grid-template-rows: 90% 10%;
	grid-template-columns: 1fr;
	.compare-info {
		text-transform: uppercase;
		letter-spacing: 0.1rem;
		width: 100%;
		display: grid;
		grid-template-rows: 40% 60%;
		color: white;
		.compare-details {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.compare-image {
				height: 10rem;
			}
		}
	}
}

.compare-action-buttons {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	width: 100%;
	height: 100%;
	button {
		font-size: 1.2rem;
		font-weight: 400;
		text-transform: uppercase;
		border: none;
		color: rgb(228, 228, 228);
		letter-spacing: 0.1rem;
		cursor: pointer;
		border: 1px solid rgba(255, 255, 255, 0.647);
		background-color: transparent;
		transition: 0.3s ease-in-out;
		&:nth-of-type(1) {
			&:hover {
				background-color: #27af0f;
				border-color: #27af0f;
			}
		}
		&:nth-of-type(2) {
			&:hover {
				background-color: #1f51ff;
				border-color: #1f51ff;
			}
		}
		&:nth-of-type(3) {
			&:hover {
				background-color: #e21b5a;
				border-color: #e21b5a;
			}
		}
	}
}

.pokemon-types-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: flex-start;
	max-height: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
	padding-bottom: 1rem;
	.pokemon-types {
		display: grid;
		grid-template-columns: 25% 75%;
		gap: 2rem;
		width: 100%;
		.pokemon-type-title {
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
		.pokemon-type-icons {
			display: flex;
			gap: 1rem;
			width: 100%;
			flex-wrap: wrap;
			.pokemon-type {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				gap: 1rem;
				&-image {
					height: 2rem;
					width: 2rem;
				}
			}
		}
	}
}

.scrollbar-hidden::-webkit-scrollbar {
	display: none;
}

/* Hide scrollbar for IE, Edge add Firefox */
.scrollbar-hidden {
	-ms-overflow-style: none;
	scrollbar-width: none; /* Firefox */
}

@media screen and (max-width: 768px) {
	button {
		font-size: 2rem;
		// border-radius: 5rem;
	}
	h3 {
		font-size: medium;
	}
	.compare-image {
		height: 7rem;
	}
	.pokemon-type {
		width: 50%;
	}
	.pokemon-type-image {
		width: 50%;
	}
}

## components/login.scss

.login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	&-btn {
		background-color: transparent;
		color: white;
		font-size: 1rem;
		text-transform: uppercase;
		padding: 1rem;
		border: 2px solid white;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 700;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		transition: 0.4s ease-in-out;
		svg {
			font-size: 3rem;
		}
		&:hover {
			border-top-color: rgba(222, 18, 48, 0.943);
			border-left-color: rgb(184, 242, 24);
			border-right-color: rgb(55, 162, 249);
			border-bottom-color: rgb(3, 169, 91);
			border-radius: 3rem;
			border-width: 8px;
		}
	}
}


## /components/_info.scss

.details {
	position: absolute;
	top: 1rem;
	left: 1rem;
	color: white;
	padding: 1rem;
	width: 25rem;
	text-transform: uppercase;
	&::before {
		height: 0.3rem;
		width: 10rem;
		content: "";
		background-color: var(--accent-color);
		position: absolute;
		top: 0;
		left: 0;
	}
	&::after {
		height: 6rem;
		width: 0.25rem;
		content: "";
		background-color: var(--accent-color);
		position: absolute;
		top: 0;
		left: 0;
	}
	.name {
		margin-bottom: 1rem;
	}
	button {
		position: absolute;
		right: 1rem;
		bottom: -2rem;
		padding: 0.8rem;
		background-color: transparent;
		border: 0.1rem solid var(--accent-color);
		outline: none;
		color: white;
		text-transform: uppercase;
		font-weight: 700;
		letter-spacing: 0.1rem;
		&:hover {
			background-color: var(--accent-color);
		}
	}
	background: linear-gradient(
				$bg-color ($dot-space - $dot-size),
				transparent 1%
			)
			center,
		$dot-color;
}

.stats {
	position: absolute;
	left: 1rem;
	bottom: 4rem;
	ul {
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		li {
			color: white;
			text-align: right;
			text-transform: uppercase;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: 1rem;
			letter-spacing: 0.1rem;
			progress {
				transition: 2s ease-in-out;
				width: 0;
				height: 100%;
				-webkit-appearance: none;
				appearance: none;
				&::-webkit-progress-bar {
					border-radius: 1rem;
					height: 0.3rem;
					background-color: transparent;
				}
				&::-webkit-progress-value {
					border-radius: 1rem;
					background-color: var(--accent-color);
				}
			}
		}
	}
}

.battle-stats {
	position: absolute;
	bottom: 2.5rem;
	right: 1rem;
	color: white;
	padding: 1rem;
	width: 30rem;
	&::before {
		height: 0.3rem;
		width: 10rem;
		content: "";
		background-color: var(--accent-color);
		position: absolute;
		bottom: 0;
		right: 0;
	}
	&::after {
		height: 6rem;
		width: 0.25rem;
		content: "";
		background-color: var(--accent-color);
		position: absolute;
		bottom: 0;
		right: 0;
	}
	.name {
		margin-bottom: 1rem;
	}
	ul {
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		letter-spacing: 0.1rem;
		li {
			display: grid;
			grid-template-columns: max-content 80%;
			gap: 0.5rem;
			:first-child {
				text-align: right;
			}
		}
	}
	.add-pokemon {
		position: absolute;
		left: -1rem;
		bottom: -2rem;
		padding: 0.8rem;
		background-color: transparent;
		border: 0.1rem solid var(--accent-color);
		outline: none;
		color: #fff;
		text-transform: uppercase;
		font-weight: 700;
		letter-spacing: 0.1rem;
		cursor: pointer;
		transition: 0.2s ease-in-out;
		&:hover {
			background-color: var(--accent-color);
		}
	}
	background: linear-gradient(
				$bg-color ($dot-space - $dot-size),
				transparent 1%
			)
			center,
		$dot-color;
}


## /components/-loader.scss

.loader {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}


## components/_pokemon_container.scss

.circle-container {
	display: flex;
	margin-top: 3rem;
	.outer-circle {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 24rem;
		width: 24rem;
		border: 0.2rem solid var(--accent-color);
		border-radius: 50rem;
		position: relative;
	}
	.inner-circle {
		height: 20rem;
		width: 20rem;
		border: 0.3rem solid var(--accent-color);
		border-radius: 40rem;
		display: flex;
		justify-content: center;
		align-items: center;
		img {
			max-inline-size: 100%;
			block-size: auto;
			z-index: 100;
			height: 18rem;
		}
	}
	.lines {
		display: flex;
		gap: 3rem;
		position: absolute;
		.line {
			height: 28rem;
			width: 0.3rem;
			background-color: var(--accent-color);
			transform: rotate(45deg);
		}
	}
}

.circle-container-2 {
	.outer-circle {
		border-color: #59591c;
	}
	.inner-circle {
		border-color: #ffff33;
	}
	.lines {
		.line {
			background-color: #ffff33;
		}
	}
}

.circle-container-3 {
	.outer-circle {
		border-color: #833719;
	}
	.inner-circle {
		border-color: #ff5f1f;
	}
	.lines {
		.line {
			background-color: #ff5f1f;
		}
	}
}

@media screen and (max-width: 768px) {
	.circle-container {
		.outer-circle {
			border: none;
		}
		.inner-circle {
			border: none;
			img {
				display: flex;
				max-inline-size: 100%;
				height: 13rem;
			}
		}
		.lines {
			display: none;
		}
	}
}


## /components/_pokemon_card.scss

.card-container {
	position: relative;
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	min-width: fit-content;
	img {
		height: 300px;
		padding-bottom: 50px;
		object-fit: cover;
		&_correct {
			scale: 1.5;
			transition: all 0.3s ease-out;
		}
		&_incorrect {
			scale: 1;
			filter: brightness(0.5);
		}
	}
	&__text {
		position: absolute;
		bottom: 0;
		left: 0;
		// margin: 10px 0px;
		font-weight: 300;
	}
}

## /sections/_index.scss

@import "navbar";
@import "footer";
@import "wrapper";

## /pages/_navbar.scss

nav {
	display: grid;
	grid-template-columns: 5rem auto 5rem;
	border-bottom: 0.5px solid rgba(255, 255, 255, 0.23);
	.block {
		display: flex;
		justify-content: center;
		align-items: center;
		svg {
			color: white;
			font-size: 2rem;
			cursor: pointer;
		}
		img {
			cursor: pointer;
			height: 3rem;
		}
	}
	.data {
		border: 0.5px solid rgba(255, 255, 255, 0.23);
		border-top: none;
		border-bottom: none;
		padding: 0 auto;
		ul {
			display: grid;
			grid-template-columns: repeat(5, 20%);
			height: 100%;
			list-style-type: none;
			z-index: 1;
			position: relative;
			a {
				display: flex;
				color: #fff;
				margin: 0 10px;
				justify-content: center;
				align-items: center;
				border-bottom: 1px solid transparent;
				text-decoration: none;
				position: relative;
				li {
					text-transform: uppercase;
					cursor: pointer;
					font-weight: 500;
					letter-spacing: 0.1rem;
				}
				.toast-notification {
					position: absolute;
					top: 15px;
					right: 0;
					width: 18px;
					height: 20px;
					background-color: red;
					color: #fff;
					border-radius: 50%;
					font-size: smaller;
					text-align: center;
				}
			}
		}
	}
}

.underline {
	display: block;
	position: absolute;
	z-index: 0;
	bottom: 0;
	left: 0;
	background-color: var(--accent-color);
	width: 20%;
	height: calc(5px / 2);
	mix-blend-mode: initial;
	pointer-events: none;
	transition: 0.5s ease-in-out;
	&:nth-child(1) {
		transition: calc(0.5s * 1.2) ease-in-out;
	}
}
@media screen and (min-width: 660px) {
	.data {
		padding: 0 5rem;
	}
}
@media screen and (min-width: 780px) {
	.data {
		padding: 0 10rem;
	}
}
@media screen and (min-width: 1024px) {
	.data {
		padding: 0 20rem;
	}
}


## /sections/_footer.scss

footer {
	display: grid;
	grid-template-columns: 5rem auto 5rem;
	border-top: 0.5px solid rgba(255, 255, 255, 0.23);
	.block {
		display: flex;
		justify-content: center;
		align-items: center;
		svg {
			color: #e21b5a;
			font-size: 2.5rem;
			cursor: pointer;
		}
		img {
			cursor: pointer;
			height: 3rem;
		}
	}
	.data {
		margin: 0;
		border: 0.5px solid rgba(255, 255, 255, 0.23);
		border-top: none;
		border-bottom: none;
		ul {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			// width: 100%;
			height: 100%;
			list-style-type: none;
			li {
				color: #fff;
				text-transform: uppercase;
				font-weight: 500;
				letter-spacing: 0.2rem;
				display: flex;
				justify-content: center;
				padding: 10px 20px;
				align-items: center;
				cursor: pointer;
				transition: 0.3s ease-in-out;
				&:hover {
					background-color: var(--accent-color);
				}
			}
			.active {
				background-color: var(--accent-color);
			}
		}
	}
}


## sections/_wrapper.scss

.content {
	display: flex;
	justify-content: center;
	position: relative;
	overflow: hidden;
}

.content {
	background: linear-gradient(
				90deg,
				$bg-color($dot-space - $dot-size),
				transparent 1%
			)
			center,
		linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
		$dot-color;
	background-size: $dot-space $dot-space;
}


## pages Styles

/scss/pages/_index.scss

@import "search";
@import "compare";
@import "list";
@import "play";
@import "pokemon";
@import "locations";
@import "capable_moves";


/pages/_search.scss

.search {
	height: 100%;
	width: 100%;
	max-width: 100%;
	color: white;
	text-transform: uppercase;

	.searchbar {
		background-color: rgba(255, 255, 255, 0.125);
		outline: none;
		border: none;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		width: 100%;
		height: 10%;
		color: white;
		font-size: 1.3rem;
		padding-left: 1rem;
		&::-webkit-input-placeholder {
			color: rgba(255, 255, 255, 0.779);
		}
	}
}


/pages/_compare.scss

.compare {
	display: grid;
	grid-template-columns: 49% 49%;
	height: 100%;
	width: 100%;
	padding: 1rem;
	gap: 1rem;
	overflow-y: scroll;
}

@media screen and (max-width: 768px) {
	.compare {
		display: flex;
      flex-direction: column;
		width: 100%;
		gap: 4frem;
	}
}



/pages/_list.scss

.list {
	height: 100%;
	width: 100%;
	max-width: 100%;
	color: #fff;
	text-transform: uppercase;
}


/pages/play.scss

.play {
	height: 100%;
	width: 100%;
	max-width: 100%;
	color: #fff;
	text-transform: uppercase;
}


/pages/pokemon.scss

// Evolution
.page {
	width: 100%;
	height: 100%;
}

@media screen and (max-width: 768px) {
	.description {
		display: flex;
		flex-direction: column-reverse;
		overflow: scroll;
		.stats {
			display: none;
		}
		.battle-stats {
			position: absolute;
			bottom: 20px;
			left: 10px;
			margin-top: 5rem;
		}

		.add-pokemon,
		button {
			font-size: 10px;
		}
	}
}


/pages/_capable_moves.scss

.capable-moves {
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	&-title {
		color: white;
		text-transform: uppercase;
		letter-spacing: 0.1rem;
		padding: 1rem;
	}
	&-list {
		list-style-type: none;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-auto-rows: 150px;
		gap: 1rem;
		padding: 1rem;
		width: 100%;
		overflow-y: scroll;
		.move {
			height: 100%;
			padding: 2rem;
			text-transform: uppercase;
			font-size: x-large;
			background-color: rgba(255, 255, 255, 0.125);
			border-radius: 1rem;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			color: white;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			cursor: pointer;
		}
	}
	.ability {
		.move {
			background-color: var(--accent-color);
		}
	}
}


/pages/_locations.scss

.locations {
	width: 100%;
	height: 100%;
	.locations-list {
		list-style-type: none;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-auto-rows: 150px;
		gap: 1rem;
		padding: 1rem;
		width: 100%;
		height: 100%;
		overflow: scroll;
		.location {
			height: 100%;
			padding: 2rem;
			font-size: x-large;
			background-color: rgba(255, 255, 255, 0.125);
			color: #fff;
			border-radius: 1rem;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			cursor: pointer;
		}
	}
}


