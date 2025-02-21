import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch top tracks from Flask backend
        axios.get('/user/playlists')
            .then(response => {
                setPlaylists(response.data.items);
                console.log("User Playlists", response.data)
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Your Public Playlists</h1>
            <ul>
                {playlists.map((playlist, index) => (
                    <li key={index}>
                        <strong>{playlist.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserPlaylists;