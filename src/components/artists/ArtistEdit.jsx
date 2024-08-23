import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import './ArtistNew.css';

function ArtistEdit() {
    const { token } = useAuth("state");
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Usamos useFetch para obtener los datos del artista
    const [{ data: artistData, isError: fetchError, isLoading: fetchLoading }, doFetch] = useFetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/artists/${id}/`, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });

    useEffect(() => {
        doFetch();
    }, [id]);

    useEffect(() => {
        if (artistData) {
            setName(artistData.name || ''); 
            setBio(artistData.bio || '');   
            setWebsite(artistData.website || '');
            setImage(artistData.image || null);
        }
    }, [artistData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('bio', bio);
        formData.append('website', website);
        if (image) formData.append('image', image);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/artists/${id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el artista');
            }

            const data = await response.json();
            setSuccessMessage(`Artista ${data.name} actualizado con éxito.`);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (fetchLoading) return <p>Cargando...</p>;
    if (fetchError) return <p>Error al cargar los detalles del artista</p>;
    if (!artistData) return <p>No se encontraron detalles del artista</p>;

    return (
        <div className="artist-edit-container">
            <h2>Editar Artista</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='artist-name'>Nombre del Artista:</label>
                    <input
                        type='text'
                        id='artist-name'
                        name='artist-name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='artist-bio'>Bio del artista:</label>
                    <textarea
                        id='artist-bio'
                        name='artist-bio'
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='artist-website'>Website del Artista:</label>
                    <input
                        type='text'
                        id='artist-website'
                        name='artist-website'
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='artist-image'>Imagen del Artista:</label>
                    <input
                        type='file'
                        id='artist-image'
                        name='artist-image'
                        accept='image/*'
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Actualizar Artista'}
                </button>
            </form>
            <button onClick={() => navigate('/artists')}>Volver</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && (
                <p style={{ color: 'green' }}>{successMessage}</p>
            )}
        </div>
    );
}

export default ArtistEdit;