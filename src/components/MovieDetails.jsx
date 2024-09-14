import { useState, useEffect } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";

export default function MovieDetails({
	selectedId, onCloseMovie, onAddWatchedMovie, watched,
}) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState(null);

	const isWatched = watched.find((movie) => movie.imdbID === selectedId);

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true);
			const res = await fetch(
				`http://www.omdbapi.com/?apikey=${import.meta.env.VITE_API_KEY}&i=${selectedId}`
			);
			const data = await res.json();
			setMovie(data);
			setIsLoading(false);
		}
		getMovieDetails();
	}, [selectedId]);

	useEffect(() => {
		if (!movie.Title) return;
		document.title = `Movie | ${movie.Title}`;
		return () => {
			document.title = "usePopcorn";
		};
	}, [movie]);

	useEffect(() => {
		function callback(e) {
			if (e.key === "Escape") {
				onCloseMovie();
			}
		}
		document.addEventListener("keydown", callback);

		return () => {
			document.removeEventListener("keydown", callback);
		};
	}, [onCloseMovie]);

	const {
		Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre,
	} = movie;

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ")[0]),
			userRating,
		};
		onAddWatchedMovie(newWatchedMovie);
		onCloseMovie();
	}

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie} movie`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐️</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating
										size={24}
										maxRating={10}
										onSetRating={setUserRating} />
									{userRating > 0 && (
										<button
											className="btn-add"
											onClick={handleAdd}
										>
											+ Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You rated this movie {isWatched.userRating}{" "}
									⭐️
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}
