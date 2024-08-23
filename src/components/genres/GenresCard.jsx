import React from 'react';
import { useNavigate } from "react-router-dom";
import style from "../genres/GenresCard.module.css";
import imagen from "../../assets/genres_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";

function GenresCard({ genress }) {
    const navigate = useNavigate();
    const handleGenreClick = () => {
        navigate(`/genres/${genress.id}`)
    }

    return (
        <div className={style.card} onClick={handleGenreClick}>
            <div className={style["card-content"]}>
                <img src={imagen} alt="genre-name" />
                <p className={style["genre-name"]}>{genress.name}</p>
                <p className={style["description"]}>{genress.description}</p>
                <p className={style['cantSongs']}>Cantidad de canciones: {genress.songs.length}</p>
            </div>
        </div>
    );
}

export default GenresCard;