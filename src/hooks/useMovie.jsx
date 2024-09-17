import { useEffect, useState } from "react";

export function useMovie(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	//callback?.()

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

		fetchMovies();

		return () => {
			controller.abort();
		};
	}, [query]);

	return { movies, isLoading, error };
}
