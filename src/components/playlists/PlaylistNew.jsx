import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Playlists.css';

function PlaylistNew({ onPlaylistCreated }) {
	const { token } = useAuth('state');
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!name.trim() || !description.trim()) {
			alert('Todos los campos son obligatorios');
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL_HARMONY}/playlists/`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Token ${token}`,
					},
					body: JSON.stringify({ name, description }),
				}
			);

			if (!response.ok) {
				throw new Error('Error al crear la lista de reproducción');
			}

			const data = await response.json();
			setName('');
			setDescription('');

			if (onPlaylistCreated) {
				onPlaylistCreated(data);
			}

			navigate('/playlists');
		} catch (error) {
			alert('Hubo un error al crear la lista de reproducción');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='playlist-new-container'>
			<h2>Nueva lista de Reproducción</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor='playlistName'>Nombre:</label>
					<input
						type='text'
						id='playlistName'
						name='playlistName'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor='playlistDescription'>Descripción:</label>
					<input
						type='text'
						id='playlistDescription'
						name='playlistDescription'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<button type='submit' disabled={isSubmitting}>
					{isSubmitting ? 'Enviando...' : 'Crear Lista'}
				</button>
			</form>
			<button onClick={() => navigate('/playlists')}>Volver</button>
		</div>
	);
}

export default PlaylistNew;
