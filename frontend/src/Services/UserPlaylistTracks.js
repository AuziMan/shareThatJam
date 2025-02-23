import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/config';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserPlaylistTracks = () => {
    const { playlistId } = useParams();  // Get playlist ID from URL
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/user/playlistTracks?playlistId=${playlistId}`, { withCredentials: true })
            .then(response => {
                console.log("Playlist Tracks", response.data);
                setTracks(response.data.items || []);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [playlistId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='playlist-tracks-container'>
            <h1>Playlist Tracks</h1>
            <ul>
                {tracks.map((track, index) => (
                    <li key={index}>
                        {track.track.name} - {track.track.artists.map(artist => artist.name).join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserPlaylistTracks;
