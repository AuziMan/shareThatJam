import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        <div className='playlist-container'>
            <h1>Your Public Playlists</h1>
            <div>
                {playlists.map((playlist) => (
                    <div className="d-flex justify-content-center mt-3">
                        <Link 
                            key={playlist.id}
                            to={`/playlistTracks/${playlist.id}`}>
                            <button className='btn btn-primary rounded-pill shadow-sm px-4 py-2'>
                            {playlist.name}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserPlaylists;