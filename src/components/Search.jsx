import { useEffect, useRef } from "react";

export default function Search({ query, setQuery }) {
	const inputElement = useRef(null);

	useEffect(() => {
		function callback(e){
			if(document.activeElement === inputElement.current) return;

			if(e.key === 'Enter'){
				inputElement.current.focus();
				setQuery('');
			}
		}
		document.addEventListener('keydown', callback);

		return () => {
			document.removeEventListener('keydown', callback);
		};

	},[setQuery]);
	
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputElement}/>
	);
}
