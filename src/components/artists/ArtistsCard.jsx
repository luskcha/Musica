import { useNavigate } from "react-router-dom";

function ArtistsCard({ artist }){
    const imageStyle = {
        backgroundImage: `url(${artist.image})`,
        backgroundSize: 'cover',
        width: '50px',
        height: '50px',
        display: 'block',
    };
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/artists/${artist.id}`)
    }

    return (
        <div className="card" onClick={handleCardClick}>
            <div className="card-content">
                <i style={imageStyle}></i>
                <p className="artists-name">{artist.name}</p>
            </div>
        </div>
    );
};

export default ArtistsCard;