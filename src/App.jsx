import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import NavBar from "./components/NavBar";
import NumResults from "./components/NumResults";
import Search from "./components/Search";
import Main from "./components/Main";
import Box from "./components/Box";
import MovieDetails from "./components/MovieDetails";
import MovieList from "./components/MovieList";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMoviesList";

export const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState(()=>{
		const watched = localStorage.getItem("watched");
		return watched ? JSON.parse(watched) : [];
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	useEffect(() => {
		const controller = new AbortController();
		async function fetchMovies() {
			try {
				setError("");
				setIsLoading(true);
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${
						import.meta.env.VITE_API_KEY
					}&s=${query}`,
					{ signal: controller.signal }
				);
				if (!res.ok)
					throw new Error(
						"Semothing went wrong with fetching movies"
					);

				const data = await res.json();
				if (data.Response === "False")
					throw new Error("Movie not found");

				setMovies(data.Search);
				setError("");
			} catch (error) {
				setMovies([]);
				if (error.name !== "AbortError") {
					setError(error.message);
				}
			} finally {
				setIsLoading(false);
			}
		}

		if (query.length < 3) {
			setMovies([]);
			setError("");
			return;
		}

		handleCloseMovie();
		fetchMovies();

		return () => {
			controller.abort();
		};
	}, [query]);

	useEffect(()=> {
		localStorage.setItem("watched", JSON.stringify(watched));
	}, [watched]);

	function handleSelectMovie(id) {
		setSelectedId((prevId) => (prevId === id ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatchedMovie(movie) {
		setWatched((prevWatched) => [...prevWatched, movie]);
	}

	function handleDeleteWatchedMovie(id) {
		setWatched((prevWatched) =>
			prevWatched.filter((movie) => movie.imdbID !== id)
		);
	}

	return (
		<>
			<NavBar>
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>
			<Main>
				<Box>
					{/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList
							movies={movies}
							onSelectMovie={handleSelectMovie}
						/>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatchedMovie={handleAddWatchedMovie}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatched={handleDeleteWatchedMovie}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}


