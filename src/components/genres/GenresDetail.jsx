import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SongsCard from '../songs/SongsCard';
import "../genres/GenresDetail.css";

function GenresDetail() {
    const { id } = useParams();
    const [genre, setGenre] = useState(null);
    const [songs, setSongs] = useState([]);
    const [isFetchingSongs, setIsFetchingSongs] = useState(false);
    const [{ data, isError, isLoading }, doFetch] = useFetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/genres/${id}/`);
    const navigate = useNavigate();

    useEffect(() => {
        doFetch();
    }, [id]);

    useEffect(() => {
        if (data) {
            setGenre(data);
            if (data.songs && data.songs.length > 0) {
                fetchSongs(data.songs);
            }
        }
    }, [data]);

    const fetchSongs = async (songIds) => {
        setIsFetchingSongs(true);
        try {
            const fetchedSongs = await Promise.all(
                songIds.map(id =>
                    fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/songs/${id}`)
                    .then(response => response.json())
                )
            );
            setSongs(fetchedSongs);
        } catch (error) {
            console.error("Error fetching songs:", error);
        } finally {
            setIsFetchingSongs(false);
        }
    };

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar los detalles del genero</p>;
    if (!genre) return <p>No se encontraron detalles del genero</p>;

    return (
        <div className='detail'>
            <div className='card'>
                <h2 className='title'>{genre.name}</h2>
                <h3 className='subtitle'>Canciones de esta genero:</h3>
                {isFetchingSongs ? (
                    <p>Cargando canciones...</p>
                ) : (
                    <div className="songs-list">
                        {songs.length > 0 ? (
                            songs.map(song => (
                                <SongsCard key={song.id} songss={song} />
                            ))
                        ) : (
                            <p>No hay canciones para este genero.</p>
                        )}
                    </div>
                )}
                <button onClick={()=> navigate("/genres")}>Volver</button>
            </div>
        </div>
    );
}

export default GenresDetail;
