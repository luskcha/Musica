import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SongsCard from './songs/SongsCard';
import useFetch from './../hooks/useFetch';
import './Home.css';

function Home() {
	const navigate = useNavigate();
	const [randomSongs, setRandomSongs] = useState([]);
	const songsToShow = 9;

	const url = `${import.meta.env.VITE_API_BASE_URL_HARMONY}/songs/`;
	const [{ data, isError, isLoading }, doFetch] = useFetch(url, {});

	useEffect(() => {
		doFetch();
	}, []);

	useEffect(() => {
		if (data && data.results) {
			const shuffled = data.results.sort(() => 0.5 - Math.random());
			const selectedSongs = shuffled.slice(0, songsToShow);
			setRandomSongs(selectedSongs);
		}
	}, [data]);

	if (isLoading && randomSongs.length === 0) return <p>Cargando...</p>;
	if (isError) return <p>Error al cargar las canciones</p>;

	return (
		<div className='title'>
			<h1>Inicio</h1>

			<p className='parrafo'>Volver a escuchar</p>
			<div className='grid-container'>
				{randomSongs.map((song) => (
					<div key={song.id} className='song-card-container'>
						<SongsCard songss={song} />
					</div>
				))}
			</div>
		</div>
	);
}

export default Home;
