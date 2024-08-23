import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

function GenreNew() {
    const {token} = useAuth("state");
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_HARMONY}/genres/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el genero');
            }

            const data = await response.json();
            setSuccessMessage(`Genero ${data.name} creado con éxito.`);
            setName('');
            setDescription('');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Crear Nuevo Genero</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="genre-name">Nombre del Genero:</label>
                    <input
                        id="genre-name"
                        name="genre-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="genre-description">Descripcion del Genero:</label>
                    <textarea
                        id="genre-description"
                        name="genre-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Crear Genero'}
                </button>
            </form>
            <button onClick={() => navigate("/genres")}>Volver</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}

export default GenreNew;
