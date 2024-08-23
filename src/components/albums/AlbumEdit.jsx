import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

function AlbumEdit() {
    const { token } = useAuth('state');
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [artist, setArtist] = useState('');
    const [cover, setCover] = useState('');
    const [newCover, setNewCover] = useState(null);
    const [newArtist, setNewArtist] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [artists, setArtists] = useState([]);
    const [isAddingArtist, setIsAddingArtist] = useState(false);

    const fetchAllData = async (url) => {
        let allData = [];
        while (url) {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            const data = await response.json();
            allData = [...allData, ...data.results];
            url = data.next; // Actualiza la URL al próximo "next"
        }
        return allData;
    };

    useEffect(() => {
        const fetchData = async () => {
            const artistsData = await fetchAllData(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/artists/`);
            setArtists(artistsData);
        };

        fetchData();
    }, [token]);

    const [{ data: albumData, isError: fetchError, isLoading: fetchLoading }, doFetch] = useFetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/albums/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });

    useEffect(() => {
        doFetch();
    }, [id]);

    useEffect(() => {
        if (albumData) {
            setTitle(albumData.title || ''); 
            setYear(albumData.year || '');   
            setArtist(albumData.artist || '');
            setCover(albumData.cover || '');
        }
    }, [albumData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('year', year);
        formData.append('artist', artist);
        if (newCover) formData.append('cover', newCover);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/albums/${id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el album');
            }

            const data = await response.json();
            setSuccessMessage(`Album ${data.title} actualizado con éxito.`);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (fetchLoading) return <p>Cargando...</p>;
    if (fetchError) return <p>Error al cargar los detalles del album</p>;
    if (!albumData) return <p>No se encontro el album</p>;

    return (
        <div className="album-edit-container">
            <h2>Editar Album</h2>
            <form onSubmit={handleSubmit}>
            <div>
                    <label htmlFor='album-title'>Titulo del Album:</label>
                    <input
                        type='text'
                        id='album-title'
                        name='album-title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='album-year'>Año de publicacion:</label>
                    <input
                        type='number'
                        id='album-year'
                        name='album-year'
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>
                <div>
                    <label>Artista:</label>
                    <select
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar artista</option>
                        {artists.map((artist) => (
                            <option key={artist.id} value={artist.id}>{artist.name}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => setIsAddingArtist(true)}>Agregar nuevo artista</button>
                    {isAddingArtist && (
                        <div>
                            <input
                                type="text"
                                value={newArtist}
                                onChange={(e) => setNewArtist(e.target.value)}
                                placeholder="Nombre del nuevo artista"
                            />
                            <button type="button" onClick={async () => {
                                try {
                                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/artists/`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Token ${token}`,
                                        },
                                        body: JSON.stringify({ name: newArtist }),
                                    });
                                    if (!response.ok) throw new Error('Error al agregar el artista');
                                    const data = await response.json();
                                    setArtists([...artists, data]);
                                    setNewArtist('');
                                    setIsAddingArtist(false);
                                } catch (error) {
                                    setError(error.message);
                                }
                            }}>Guardar artista</button>
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor='album-cover'>Cover del Album:</label>
                    <input
                        type='file'
                        id='album-cover'
                        name='album-cover'
                        accept='image/*'
                        onChange={(e) => setNewCover(e.target.files[0])}
                    />
                </div>
                <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Actualizar Album'}
                </button>
            </form>
            <button onClick={() => navigate('/albums')}>Volver</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && (
                <p style={{ color: 'green' }}>{successMessage}</p>
            )}
        </div>
    );
}

export default AlbumEdit;