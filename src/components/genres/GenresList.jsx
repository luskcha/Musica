import GenresCard from "./GenresCard";
import useFetch from "../../hooks/useFetch";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../genres/GenresList.css";

// Componente que genera una lista de card con todas las canciones de la API
function GenresList() {
    const [genres, setGenres] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const genresPerPage = 5; // Cantidad de generos por página
    const navigate = useNavigate();

    // Generar la URL de la API para la página actual
    const nextUrl = `${import.meta.env.VITE_API_BASE_URL_HARMONY}/genres/?page=${currentPage}&page_size=${genresPerPage}`;

    const [{ data, isError, isLoading }, doFetch] = useFetch(nextUrl, {});

    useEffect(() => {
        doFetch();
    }, [nextUrl]);

    useEffect(() => {
        if (data) {
            setGenres(data.results);
            setTotalPages(Math.ceil(data.count / genresPerPage)); // Calcula el total de páginas
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

    const handleNewGenre = () => {
        navigate('/genres/new')
    }

    if (isLoading && genres.length === 0) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar los generos</p>;
    if (genres.length === 0) return <p>No hay generos disponibles</p>;


    return (
        <div>
            <div className="mainList">
                <h2 className="title">Lista de Generos</h2>
                <ul className="genresGrids">
                    {genres.map(genre => (
                        <div key={genre.id} className="column">
                            <GenresCard genress={genre} />
                        </div>
                    ))}
                </ul>
                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    <span className="page-number">Página {currentPage} de {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Siguiente
                    </button>
                    <button onClick={handleNewGenre}>
                        Nuevo Genero
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GenresList;