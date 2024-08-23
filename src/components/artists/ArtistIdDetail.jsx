import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { useAuth } from '../../contexts/AuthContext';

function ArtistIdDetail() {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [user, setUser] = useState(null);
    const [hasSongs, setHasSongs] = useState(false); // Estado para verificar canciones asociadas
    const [{ data, isError, isLoading }, doFetch] = useFetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/artists/${id}/`);
    const navigate = useNavigate();
    const { token } = useAuth("state");

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profiles/profile_data/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const userData = await response.json();
                setUser(userData);
            }
        };

        fetchUser();
    }, [token]);

    useEffect(() => {
        doFetch();
    }, [id]);

    useEffect(() => {
        if (data) {
            setArtist(data);
            setHasSongs(data.songs.length > 0);
        }
    }, [data]);

    const handleEditArtist = () => {
        navigate(`/artists/${id}/edit`);
    };

    const handleDeleteArtist = async () => {
        if (hasSongs) {
            alert("No se puede eliminar el artista porque tiene canciones asociadas.");
            return;
        }

        if (window.confirm("¿Estás seguro de que deseas eliminar este artista? Esta acción no se puede deshacer.")) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/artists/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el artista');
                }

                alert('Artista eliminado con éxito.');
                navigate('/artists'); // Redirige a la lista de artistas después de eliminar
            } catch (error) {
                alert(error.message);
            }
        }
    };

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar los detalles del artista</p>;
    if (!artist) return <p>No se encontraron detalles del artista</p>;

    // Verifica si el artista fue creado por el usuario logueado
    const canEdit = user && artist.owner === user.user__id;

    return (
        <div>
            <h2>{artist.name}</h2>
            <img src={artist.image} alt={artist.name} style={{ width: '300px', height: '300px' }} />
            <p>{artist.bio}</p>
            <p>{artist.website}</p>
            {canEdit && (
                <>
                    <button onClick={handleEditArtist}>Editar</button>
                    <button onClick={handleDeleteArtist}>Eliminar</button>
                </>
            )}
            <button onClick={() => navigate(`/artists/${id}/songs`)}>Canciones</button>
            <button onClick={() => navigate("/artists")}>Volver</button>
        </div>
    );
}

export default ArtistIdDetail;
