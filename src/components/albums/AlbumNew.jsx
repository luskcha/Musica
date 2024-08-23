import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../albums/AlbumNew.css";


function AlbumNew() {
    const { token } = useAuth('state');
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [artist, setArtist] = useState('');
    const [cover, setCover] = useState(null);
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
            url = data.next; 
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

    const handleImageChange = (e) => {
        setCover(e.target.files[0]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!artist) {
            setError('Se debe seleccionar un artista para agregar un álbum.');
            setIsSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('year', year);
            formData.append('artist', artist);
            if (cover) {
                formData.append('cover', cover); 
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL_HARMONY}/albums/`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Error al crear el album');
            }

            const data = await response.json();
            setSuccessMessage(`Album ${data.title} creado con éxito.`);
            setTitle('');
            setYear('');
            setCover(null); 
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="album-new-container">
            <h2>Crear Nuevo Album</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                        onChange={handleImageChange}
                    />
                </div>
                <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Crear Album'}
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

export default AlbumNew;

