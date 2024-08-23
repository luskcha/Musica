import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';


function AlbumsCard({ albumes }){
    const imageStyle = {
        backgroundImage: `url(${albumes.cover})`,
        backgroundSize: 'cover',
        width: '50px',
        height: '50px',
        display: 'block',
    };

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { token } = useAuth("state");
    const [artist, setArtist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

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
        const fetchArtist = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/artists/${albumes.artist}/`);
                if (!response.ok) {
                    throw new Error('Error fetching artist data');
                }
                const artistData = await response.json();
                setArtist(artistData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching artist:', error);
                setIsError(true);
                setIsLoading(false);
            }
        };

        if (albumes.artist) {
            fetchArtist();
        }
    }, [albumes.artist]);

    if (isLoading) return <p>Loading artist...</p>;
    if (isError) return <p>Error loading artist</p>;

    
    const handleCardClick = () => {
        navigate(`/albums/${albumes.id}`)
    };

    const handleEditClick = (e) => {
        e.stopPropagation(); // Prevenir la propagación del clic al div contenedor
        navigate(`/albums/${albumes.id}/edit`);
    };

    // Verifica si el artista fue creado por el usuario logueado
    const canEdit = user && albumes.owner === user.user__id;

    return (
        <div className="card" onClick={handleCardClick}>
            <div className="card-content">
                <p className="albums-name">{albumes.title}</p>
                <i style={imageStyle}></i>
                <p className="albums-artist">{artist.name}</p>
                <p className="albums-year">{albumes.year}</p>
                <br />
                <br />
                {canEdit && (
                <>
                    <button onClick={handleEditClick}>Editar</button>
                </>
            )}
            </div>
        </div>
    );
};

export default AlbumsCard;