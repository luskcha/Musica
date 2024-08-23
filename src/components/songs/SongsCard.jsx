// Componente que genera un elemento card con la info de una cancion
import "../songs/SongsCard.css";

function SongsCard({ songss }) {
    const imageStyle = {
        backgroundImage: `url(${songss.cover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '150px',
        height: '150px',
        display: 'block',
        margin: '0 auto 20px auto',
    };

    return (
        <div className="card">
            <div className="card-content" style={{ textAlign: 'center' }}>
                <p className="song-title">{songss.title}</p>
                <i style={imageStyle}></i>
                <audio controls style={{ marginTop: '10px', width: '100%' }}>
                    <source src={songss.song_file} type="audio/mpeg" />
                    Tu navegador no soporta el elemento audio.
                </audio>
            </div>
        </div>
    );
};

export default SongsCard;
