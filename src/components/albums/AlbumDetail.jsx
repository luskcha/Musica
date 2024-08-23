import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SongsCard from '../songs/SongsCard';

function AlbumDetail() {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [isFetchingSongs, setIsFetchingSongs] = useState(false);
    const [{ data, isError, isLoading }, doFetch] = useFetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/albums/${id}/`);
    const navigate = useNavigate();

    useEffect(() => {
        doFetch();
    }, [id]);

    useEffect(() => {
        if (data) {
            setAlbum(data);
            fetchSongs();
            }
    }, [data]);

    const fetchSongs = async () => {
        setIsFetchingSongs(true);
        try {
            const response = await  fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/albums/${id}/songs`);
            const fetchedSongs = await response.json();
            setSongs(fetchedSongs.results);
        } catch (error) {
            console.error("Error fetching songs:", error);
        } finally {
            setIsFetchingSongs(false);
        }
    };

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar los detalles del genero</p>;
    if (!album) return <p>No se encontro el album</p>;

    return (
        <div className='detail'>
            <div className='card'>
                <h2 className='title'>{album.title}</h2>
                <h3 className='subtitle'>Canciones de este album:</h3>
                {isFetchingSongs ? (
                    <p>Cargando canciones...</p>
                ) : (
                    <div className="songs-list">
                        {songs.length > 0 ? (
                            songs.map(song => (
                                <SongsCard key={song.id} songss={song} />
                            ))
                        ) : (
                            <p>No hay canciones para este album.</p>
                        )}
                    </div>
                )}
                <button onClick={()=> navigate("/albums")}>Volver</button>
            </div>
        </div>
    );
}

export default AlbumDetail;
