import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../songs/SongNew.css";

function SongNew() {
    const { token } = useAuth("state");
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [album, setAlbum] = useState(null);
    const [artist, setArtist] = useState(null);
    const [role, setRole] = useState('');
    const [genre, setGenre] = useState(null);
    const [mp3File, setMp3File] = useState(null);
    const [newAlbum, setNewAlbum] = useState('');
    const [newArtist, setNewArtist] = useState('');
    const [newGenre, setNewGenre] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [isAddingAlbum, setIsAddingAlbum] = useState(false);
    const [isAddingArtist, setIsAddingArtist] = useState(false);
    const [isAddingGenre, setIsAddingGenre] = useState(false);

    // Función para traer todos los elementos de una API paginada
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
            const albumsData = await fetchAllData(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/albums/`);
            setAlbums(albumsData);

            const artistsData = await fetchAllData(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/artists/`);
            setArtists(artistsData);

            const genresData = await fetchAllData(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/genres/`);
            setGenres(genresData);
        };

        fetchData();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!artist) {
            setError('Se debe seleccionar un artista para agregar un álbum.');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('year', year);
        formData.append('album', album);
        formData.append('artist', artist);
        formData.append('role', role);
        formData.append('genre', genre);
        formData.append('song_file', mp3File);

        try {
            // Crear la canción
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/songs/`, {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al crear la canción');
            }

            const songData = await response.json();

            // Registrar el rol del artista
            const songArtistResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/song-artists/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    role: role,
                    song: songData.id,
                    artist: artist,
                }),
            });

            if (!songArtistResponse.ok) {
                throw new Error('Error al asociar el artista con la canción');
            }

            // Registrar el género de la canción
            const songGenreResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/song-genres/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    song: songData.id,
                    genre: genre,
                }),
            });

            if (!songGenreResponse.ok) {
                throw new Error('Error al asociar el género con la canción');
            }

            // Registrar el álbum si se especifica
            if (album) {
                const songAlbumResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/songs/${songData.id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify({
                        album: album,
                    }),
                });

                if (!songAlbumResponse.ok) {
                    throw new Error('Error al asociar el álbum con la canción');
                }
            }

            setSuccessMessage(`Canción "${songData.title}" creada con éxito.`);
            setTitle('');
            setYear('');
            setAlbum(null);
            setArtist(null);
            setRole('');
            setGenre(null);
            setMp3File(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='song-new-container'>
            <h2>Agregar Nueva Canción</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título de la Canción:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Año de Lanzamiento:</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>
                <div>
                    <label>Álbum:</label>
                    <select
                        value={album}
                        onChange={(e) => setAlbum(e.target.value)}
                    >
                        <option value="">Seleccionar álbum</option>
                        {albums.map((album) => (
                            <option key={album.id} value={album.id}>{album.title}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => setIsAddingAlbum(true)} disabled={!artist}>Agregar nuevo álbum</button>
                    {isAddingAlbum && (
                        <div>
                            <input
                                type="text"
                                value={newAlbum}
                                onChange={(e) => setNewAlbum(e.target.value)}
                                placeholder="Nombre del nuevo álbum"
                            />
                            <button type="button" onClick={async () => {
                                if (!artist) {
                                    setError('Se debe seleccionar un artista antes de agregar un álbum.');
                                    return;
                                }
                                try {
                                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/albums/`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Token ${token}`,
                                        },
                                        body: JSON.stringify({ title: newAlbum, artist: artist }),
                                    });
                                    if (!response.ok) throw new Error('Error al agregar el álbum');
                                    const data = await response.json();
                                    setAlbums([...albums, data]);
                                    setNewAlbum('');
                                    setIsAddingAlbum(false);
                                } catch (error) {
                                    setError(error.message);
                                }
                            }}>Guardar álbum</button>
                        </div>
                    )}
                </div>
                <div>
                    <label>Artista:</label>
                    <select
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
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
                    <label>Género:</label>
                    <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <option value="">Seleccionar género</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => setIsAddingGenre(true)}>Agregar nuevo género</button>
                    {isAddingGenre && (
                        <div>
                            <input
                                type="text"
                                value={newGenre}
                                onChange={(e) => setNewGenre(e.target.value)}
                                placeholder="Nombre del nuevo género"
                            />
                            <button type="button" onClick={async () => {
                                try {
                                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/genres/`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Token ${token}`,
                                        },
                                        body: JSON.stringify({ name: newGenre }),
                                    });
                                    if (!response.ok) throw new Error('Error al agregar el género');
                                    const data = await response.json();
                                    setGenres([...genres, data]);
                                    setNewGenre('');
                                    setIsAddingGenre(false);
                                } catch (error) {
                                    setError(error.message);
                                }
                            }}>Guardar género</button>
                        </div>
                    )}
                </div>
                <div>
                    <label>Rol del Artista:</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Archivo MP3:</label>
                    <input
                        type="file"
                        accept="audio/mp3"
                        onChange={(e) => setMp3File(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Agregar Canción'}
                </button>
            </form>
            <button onClick={()=> navigate("/songs")}>Volver</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}

export default SongNew;