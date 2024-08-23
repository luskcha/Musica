import AlbumsCard from "./AlbumsCard";
import useFetch from "../../hooks/useFetch";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../albums/AlbumsList.css";

function AlbumsList() {
    const [albums, setAlbums] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0); 
    const albumsPerPage = 5; 
    const [searchQuery, setSearchQuery] = useState(''); 
	const navigate = useNavigate();

    // Generar la URL de la API para la página actual
    const nextUrl = `${
        import.meta.env.VITE_API_BASE_URL_HARMONY
    }/albums/?page=${currentPage}&page_size=${albumsPerPage}&title=${searchQuery}`;

    const [{ data, isError, isLoading }, doFetch] = useFetch(nextUrl);

    useEffect(() => {
        doFetch();
    }, [nextUrl]);

    useEffect(() => {
        if (data) {
            setAlbums(data.results);
            setTotalPages(Math.ceil(data.count / albumsPerPage)); 
        }
    }, [data]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNewAlbum = () => {
		navigate('/albums/new');
	};

    const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
		setCurrentPage(1); 
	};

    if (isLoading && albums.length === 0) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar los albums</p>;

    return (
        <div className="albums-new-container">
            <div>
                <h2 className="title">Lista de Albums</h2>
                <div className='search-input-container'>
					<input
						type='text'
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder='Buscar albums...'
						className='album-search-input'
					/>
				</div>
                <button onClick={handleNewAlbum} className='new-album-button'>+ Nuevo Album</button>
                {albums.length === 0 ? (
      				<p>No hay albums disponibles</p>
    			) : (
					<ul>
						{albums.map((album) => (
						<div key={album.id} className='column is-two-third'>
							<AlbumsCard albumes={album} />
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

export default AlbumsList;
