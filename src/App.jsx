import { useState } from "react";
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
import { useMovie } from "./hooks/useMovie";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);
	const { movies, isLoading, error } = useMovie(query);
	const [watched, setWatched] = useLocalStorageState([], "watched");

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
