import PlaylistsCard from './PlaylistsCard';
import useFetch from '../../hooks/useFetch';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Playlists.css';

function Playlists() {
	const [playlists, setPlaylists] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const playlistsPerPage = 10;
	const navigate = useNavigate();

	const nextUrl = `${
		import.meta.env.VITE_API_BASE_URL_HARMONY
	}/playlists/?page=${currentPage}&page_size=${playlistsPerPage}`;

	const [{ data, isError, isLoading }, doFetch] = useFetch(nextUrl, {});

	useEffect(() => {
		const url = `${
			import.meta.env.VITE_API_BASE_URL_HARMONY
		}/playlists/?page=${currentPage}&page_size=${playlistsPerPage}`;
		doFetch(url);
	}, [currentPage]);

	useEffect(() => {
		if (data) {
			setPlaylists(data.results);
			setTotalPages(Math.ceil(data.count / playlistsPerPage));
		}
	}, [data]);

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleNewPlaylist = () => {
		navigate('/playlists/new');
	};

	const filteredPlaylists = playlists.filter((playlist) =>
		playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (isLoading && playlists.length === 0) return <p>Cargando...</p>;
	if (isError) return <p>Error al cargar las listas de reproducción</p>;
	if (playlists.length === 0)
		return <p>No hay listas de reproducción disponibles</p>;

	return (
		<div className='playlists-container'>
			<div>
				<h2 className='title'>Lista de Reproducción</h2>

				<div className='search-input-container'>
					<input
						type='text'
						placeholder='Buscar en Playlist ...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='search-input'
						id='searchPlaylist'
						name='searchPlaylist'
					/>
				</div>

				<button
					onClick={handleNewPlaylist}
					className='new-playlist-button'
				>
					+ Crear nueva Lista
				</button>

				<ul>
					{filteredPlaylists.map((playlist) => (
						<div key={playlist.id} className='column is-two-third'>
							<PlaylistsCard playlist={playlist} />
						</div>
					))}
				</ul>
				<div className='pagination-controls'>
					<button
						onClick={handlePreviousPage}
						disabled={currentPage === 1}
					>
						Anterior
					</button>
					<span>
						Página {currentPage} de {totalPages}
					</span>
					<button
						onClick={handleNextPage}
						disabled={currentPage === totalPages}
					>
						Siguiente
					</button>
				</div>
			</div>
		</div>
	);
}

export default Playlists;
