import React from 'react';
import { useNavigate } from "react-router-dom";
import imagen from '../../assets/music.png';

function PlaylistCard({ playlist }) {
    const imageUrl = playlist.image || imagen;
    const navigate = useNavigate();
    const handlePlaylistClick = () => {
        navigate(`/playlists/${playlist.id}`)
    }

    return (
        <div className="card" onClick={handlePlaylistClick}>
            <div className="card-content">
                <img src={imageUrl} alt={`${playlist.name} cover`} style={{ width: '60px', height: '60px' }} />
                <p className="title">{playlist.name}</p>
                <p className="subtitle">{playlist.description}</p>
                <p className='cantSongs'>Cantidad de canciones: {playlist.entries.length}</p>
            </div>
        </div>
    );
}

export default PlaylistCard;
