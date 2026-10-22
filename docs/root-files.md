/src/App.tsx

import { Background, Loader } from "./components";
import "./scss/index.scss";
import { Footer, Navbar } from "./sections";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect, lazy, Suspense } from "react";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearToast, setUserStatus } from "./app/slices/AppSlice";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./utils/firebase";

const Search = lazy(() => import("./pages/Search"));
const Compare = lazy(() => import("./pages/Compare"));
const MyList = lazy(() => import("./pages/MyList"));
const Pokemon = lazy(() => import("./pages/Pokemon"));
const Play = lazy(() => import("./pages/Play"));

function App() {
	const { toasts } = useAppSelector(({ app }) => app);
	const dispatch = useAppDispatch();

	useEffect(() => {
		onAuthStateChanged(firebaseAuth, (currentUser) => {
			if (currentUser) {
				dispatch(setUserStatus({ email: currentUser.email as string }));
			}
		});
	}, [dispatch]);

	useEffect(() => {
		if (toasts.length) {
			const toastOptions: ToastOptions = {
				position: "top-right",
				autoClose: 2000,
				pauseOnHover: true,
				draggable: false,
				// hideProgressBar: true,
				type: "info",
				theme: "dark",
			};
			toasts.forEach((message: string) => {
				toast(message, toastOptions);
			});
			dispatch(clearToast());
		}
	}, [toasts, dispatch]);

	return (
		<div className="main-container">
			<Background />
			<BrowserRouter>
				<Suspense fallback={<Loader />}>
					<div className="app">
						<Navbar />
						<Routes>
							<Route path="/search" element={<Search />} />
							<Route path="/list" element={<MyList />} />
							<Route path="/play" element={<Play />} />
							<Route path="/compare" element={<Compare />} />
							<Route path="/pokemon/:id" element={<Pokemon />} />
							<Route element={<Navigate to="/pokemon/1" />} path="*" />
						</Routes>
						<Footer />
						<ToastContainer />
					</div>
				</Suspense>
			</BrowserRouter>
		</div>
	);
}

export default App;


/src/index.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <App />
    </Provider>
);


package.json

{
  "name": "pokedex",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.3",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^27.5.2",
    "@types/node": "^17.0.45",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "axios": "^1.3.4",
    "extract-colors": "^2.0.5",
    "firebase": "^9.18.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.8.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.9.0",
    "react-scripts": "5.0.1",
    "react-toastify": "^9.1.1",
    "sass": "^1.59.2",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
}