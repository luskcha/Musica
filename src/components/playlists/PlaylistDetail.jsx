import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SongsCard from '../songs/SongsCard';

function PlaylistDetail() {
	const { id } = useParams();
	const [playlist, setPlaylist] = useState(null);
	const [songs, setSongs] = useState([]);
	const [isFetchingSongs, setIsFetchingSongs] = useState(false);
	const [{ data, isError, isLoading }, doFetch] = useFetch(
		`${import.meta.env.VITE_API_BASE_URL_HARMONY}/playlists/${id}/`
	);
	const navigate = useNavigate();

	useEffect(() => {
		doFetch();
	}, [id]);

	useEffect(() => {
		if (data) {
			setPlaylist(data);
			if (data.entries && data.entries.length > 0) {
				fetchSongs(data.entries);
			}
		}
	}, [data]);

	const fetchSongs = async (songIds) => {
		if (!songIds || songIds.length === 0) return;

		setIsFetchingSongs(true);
		try {
			const fetchedSongs = await Promise.all(
				songIds.map(async (id) => {
					try {
						const response = await fetch(
							`${import.meta.env.VITE_API_BASE_URL_HARMONY}/songs/${id}`
						);
						if (!response.ok)
							throw new Error('Error fetching song');
						return await response.json();
					} catch (error) {
						console.error('Error fetching song:', error);
						return null;
					}
				})
			);

			setSongs(fetchedSongs.filter(Boolean));
		} catch (error) {
			console.error('Error fetching songs:', error);
		} finally {
			setIsFetchingSongs(false);
		}
	};

	if (isLoading) return <p>Cargando...</p>;
	if (isError) return <p>Error al cargar los detalles del playlist</p>;
	if (!playlist) return <p>No se encontraron detalles del playlist</p>;

	return (
		<div>
			<h2>{playlist.title}</h2>
			<h3>Canciones en esta lista de reproducción:</h3>
			{isFetchingSongs ? (
				<p>Cargando canciones...</p>
			) : (
				<div className='songs-list'>
					{songs.length > 0 ? (
						songs.map((song) => (
							<SongsCard key={song.id} songss={song} />
						))
					) : (
						<p>No hay canciones en esta lista de reproducción.</p>
					)}
				</div>
			)}
			<button onClick={() => navigate('/playlists')}>Volver</button>
		</div>
	);
}

export default PlaylistDetail;
