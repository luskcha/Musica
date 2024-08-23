import ArtistsCard from './ArtistsCard';
import useFetch from '../../hooks/useFetch';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ArtistsList() {
	const [artists, setArtists] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const artistsPerPage = 8;
	const [searchQuery, setSearchQuery] = useState(''); 
	const navigate = useNavigate();

	// Generar la URL de la API con el filtro de búsqueda
	const nextUrl = `${
		import.meta.env.VITE_API_BASE_URL_HARMONY
	}/artists/?page=${currentPage}&page_size=${artistsPerPage}&name=${searchQuery}`;

	const [{ data, isError, isLoading }, doFetch] = useFetch(nextUrl);

	useEffect(() => {
		doFetch();
	}, [nextUrl]);

	useEffect(() => {
		if (data) {
			setArtists(data.results);
			setTotalPages(Math.ceil(data.count / artistsPerPage));
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

	const handleNewArtist = () => {
		navigate('/artists/new');
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
		setCurrentPage(1); 
	};

	if (isLoading && artists.length === 0) return <p>Cargando...</p>;
	if (isError) return <p>Error al cargar los artistas</p>;

	return (
		<div>
			<div className='my-5'>
				<h2 className='title'>Lista de Artistas</h2>
				<div className='search-input-container'>
					<input
						type='text'
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder='Buscar artistas...'
						className='artist-search-input'
					/>
				</div>
				<button onClick={handleNewArtist} className='new-artist-button'>+ Nuevo Artista</button>
				{artists.length === 0 ? (
      				<p>No hay artistas disponibles</p>
    			) : (
					<ul>
						{artists.map((artist) => (
						<div key={artist.id} className='column is-two-third'>
							<ArtistsCard artist={artist} />
						</div>
						))}
					</ul>
    			)}
				<div className='pagination-controls'>
					<button
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}
					>
						Primera
					</button>
					<button
						onClick={handlePreviousPage}
						disabled={currentPage === 1}
					>
						Anterior
					</button>
					<span>
						Página 
						<input
							type="number"
							value={currentPage}
							min="1"
							max={totalPages}
							onChange={(e) => {
								const pageNumber = Number(e.target.value);
								if (pageNumber >= 1 && pageNumber <= totalPages) {
									setCurrentPage(pageNumber);
								}
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									const pageNumber = Number(e.target.value);
									if (pageNumber >= 1 && pageNumber <= totalPages) {
										setCurrentPage(pageNumber);
									}
								}
							}}
							style={{ width: '40px', textAlign: 'center' }}
						/>
						de {totalPages}
					</span>
					<button
						onClick={handleNextPage}
						disabled={currentPage === totalPages || totalPages === 0}
					>
						Siguiente
					</button>
					<button
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages || totalPages === 0}
					>
						Última
					</button>
				</div>

			</div>
		</div>
	);
}

export default ArtistsList;

