import SongsCard from "./SongsCard";
import useFetch from "../../hooks/useFetch";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../songs/SongsList.css";

// Componente que genera una lista de card con todas las canciones de la API
function SongsList() {
    const [songs, setSongs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const songsPerPage = 5; // Cantidad de canciones por página
    const navigate = useNavigate();

    // Generar la URL de la API para la página actual
    const nextUrl = `${import.meta.env.VITE_API_BASE_URL_HARMONY}/songs/?page=${currentPage}&page_size=${songsPerPage}`;

    const [{ data, isError, isLoading }, doFetch] = useFetch(nextUrl, {});

    useEffect(() => {
        doFetch();
    }, [nextUrl]);

    useEffect(() => {
        if (data) {
            setSongs(data.results);
            setTotalPages(Math.ceil(data.count / songsPerPage)); // Calcula el total de páginas
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

    const handleNewSong = () => {
        navigate('/songs/new')
    }

    if (isLoading && songs.length === 0) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar las canciones</p>;
    if (songs.length === 0) return <p>No hay canciones disponibles</p>;

    return (
        <div>
            <div className="my-5">
                <h2 className="title">Lista de Canciones</h2>
                <button className="new-songs-button" onClick={handleNewSong}>Nueva Cancion</button>
                <ul>
                    {songs.map(song => (
                        <div key={song.id} className="column is-two-third">
                            <SongsCard songss={song} />
                        </div>
                    ))}
                </ul>
                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SongsList;